// core/QueryBuilder.js
export default class QueryBuilder {

  static buildFilter(queryParams) {
    const filter = {};

    Object.entries(queryParams).forEach(([key, value]) => {

      if (key === 'populate') return;

      // clé type : search[name]
      if (key.startsWith('search[')) {

        const field = key.replace('search[', '').replace(']', '');

        filter[field] = this.buildCondition(value);
      }

    });

    return filter;
  }

  static buildCondition(value) {

    // simple contains par défaut
    if (typeof value === 'string') {
      return { $regex: value, $options: 'i' };
    }

    return value;
  }
}
