// src/core/QueryBuilder.js

export default class QueryBuilder {

  static buildFilter(queryParams, model) {
    const filter = {};

    Object.entries(queryParams).forEach(([key, value]) => {

      if (key === 'populate') return;
      if (!key.startsWith('search[')) return;

      const field = key.replace('search[', '').replace(']', '');

      if (field === '_id') return; // 🔥 exclusion automatique

      const schemaPath = model.schema.path(field);

      if (!schemaPath) return;

      filter[field] = this.buildCondition(
        value,
        schemaPath.instance
      );

    });

    return filter;
  }

  static buildCondition(value, type) {

    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    switch (type) {

      case 'String':
        return { $regex: value, $options: 'i' };

      case 'Number':
        return Number(value);

      case 'ObjectID':
        return value;

      default:
        return value;
    }
  }
}
