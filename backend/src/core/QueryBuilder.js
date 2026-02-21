// src/core/QueryBuilder.js

export default class QueryBuilder {

  // =========================
  // MAIN ENTRY
  // =========================
static buildFilter(queryParams, model) {

  console.log('\n==============================');
  console.log('🔎 QueryBuilder.buildFilter');
  console.log('Query Params:', queryParams);

  const filter = {};
  const arrayGroups = {};

  // 🔥 NEW SAFE SECTION
  const rangeGroups = {};

  Object.entries(queryParams).forEach(([key, value]) => {

    if (key === 'populate') return;
    if (!key.startsWith('search[')) return;

    let rawPath = key.replace('search[', '').replace(']', '');
    const isMultiValue = rawPath.endsWith('[]');
      const cleanPath = isMultiValue ? rawPath.replace('[]', '') : rawPath;
      if (!cleanPath || cleanPath === '_id') return;

      // =====================================================
      // 🔥 NEW RANGE DETECTION (ISOLATED - DOES NOT BREAK FLOW)
      // =====================================================

      const rangeMatch = cleanPath.match(/(.+)_(from|to|min|max)$/);

      if (rangeMatch) {

        const basePath = rangeMatch[1];
        const suffix = rangeMatch[2];

        console.log('\n🔥 RANGE DETECTED');
        console.log('   Base Path:', basePath);
        console.log('   Suffix:', suffix);
        console.log('   Raw Value:', value);

        const typedValue = this.resolveCondition(basePath, value, model);

        if (typedValue === undefined) return;

        if (!rangeGroups[basePath]) {
          rangeGroups[basePath] = {};
        }

        if (suffix === 'from' || suffix === 'min') {
          rangeGroups[basePath].$gte = typedValue;
        }

        if (suffix === 'to' || suffix === 'max') {
          rangeGroups[basePath].$lte = typedValue;
        }

        console.log('   Current rangeGroup state:',
          JSON.stringify(rangeGroups, null, 2));

        return; // 🔥 IMPORTANT: STOP NORMAL FLOW
      }

      // =====================================================
      // NORMAL FLOW (UNTOUCHED)
      // =====================================================

      const path = cleanPath;  

    console.log('\n➡ Processing:', path, 'Value:', value);

    const arrayRoot = this.detectArrayRoot(path, model);
    console.log('   Array root detected:', arrayRoot);

    const condition = this.resolveCondition(path, value, model);
    console.log('   Resolved condition:', condition);

    if (condition === undefined) return;

    if (arrayRoot) {

      const subPath = path.substring(arrayRoot.length + 1);

      if (!arrayGroups[arrayRoot]) {
        arrayGroups[arrayRoot] = [];
      }

      arrayGroups[arrayRoot].push({
        subPath,
        condition,
        isMultiValue
      });

      console.log('   Added to arrayGroup:', arrayRoot, {
        subPath,
        condition
      });

    } else {

      filter[path] = condition;
      console.log('   Added to filter:', path, condition);
    }

  });

  console.log('\n📦 Array Groups built:', JSON.stringify(arrayGroups, null, 2));

  // ================================
  // 🔥 Traitement des tableaux
  // ================================
  Object.entries(arrayGroups).forEach(([arrayRoot, conditions]) => {

    console.log('\n⚙ Processing arrayRoot:', arrayRoot);
    console.log('Conditions:', conditions);

    // 🔹 CAS 1 : UN SEUL CHAMP
    if (conditions.length === 1) {

      const { subPath, condition } = conditions[0];

      // ✅ NEW: Primitive array handling
    if (!subPath) {

      // 🔥 1️⃣ Handle CSV: search[tags]=a,b,c
      if (typeof condition === 'string' && condition.includes(',')) {

        const values = condition
          .split(',')
          .map(v => v.trim())
          .filter(v => v !== '');

        // filter[arrayRoot] = { $in: values };
        // filter[arrayRoot] = { $all: values };
          // 🔹 ET logique + regex partiel
          filter[arrayRoot] = {
            $and: values.map(v => ({ $in: [new RegExp(v, 'i')] }))
          };



        console.log('   ✅ PRIMITIVE ARRAY CSV MODE ($in)');
        console.log('   Generated:', filter[arrayRoot]);

        return;
      }

      // 🔥 2️⃣ Handle multi param: search[tags][]=a&search[tags][]=b
      const multiValues = conditions
        .filter(c => c.isMultiValue)
        .map(c => c.condition);

      if (multiValues.length > 0) {

        filter[arrayRoot] = { $in: multiValues };

        console.log('   ✅ PRIMITIVE ARRAY MULTI VALUE MODE ($in)');
        console.log('   Generated:', JSON.stringify(filter[arrayRoot], null, 2));
        return;
      }

// 🔥 3️⃣ Single value (array of primitive)

if (typeof condition === 'string') {

  filter[arrayRoot] = {
    $elemMatch: {
      $regex: condition,
      $options: 'i'
    }
  };

  console.log('   ✅ PRIMITIVE ARRAY STRING REGEX MODE');
  console.log('   Generated:', JSON.stringify(filter[arrayRoot], null, 2));
  return;
}

if (typeof condition === 'object' && condition.$regex) {

  filter[arrayRoot] = {
    $elemMatch: condition
  };

  console.log('   ✅ PRIMITIVE ARRAY REGEX MODE ($elemMatch)');
  console.log('   Generated:', filter[arrayRoot]);
  return;
}

// fallback exact match
filter[arrayRoot] = {
  $elemMatch: { $eq: condition }
};

console.log('   ✅ PRIMITIVE ARRAY EXACT MODE');
console.log('   Generated:', JSON.stringify(filter[arrayRoot], null, 2));
return;


    }

      filter[arrayRoot] = {
        $elemMatch: {
          [subPath]: condition
        }
      };

      console.log('   ✅ SINGLE FIELD MODE (ANY)');
      console.log('   Generated:', JSON.stringify(filter[arrayRoot], null, 2));

      return;
    }

    // 🔹 CAS 2 : MULTI-CHAMPS
    const violationConditions = conditions.map(({ subPath, condition }) => {

      if (typeof condition === 'object' && condition !== null && !Array.isArray(condition)) {

        if (condition.$regex) {
          return { [subPath]: { $not: condition } };
        }

        return { [subPath]: { $ne: condition } };
      }

      return { [subPath]: { $ne: condition } };

    });

filter[arrayRoot] = {
  $elemMatch: conditions.reduce((acc, { subPath, condition }) => {
    acc[subPath] = condition;
    return acc;
  }, {})
};

    console.log('   ✅ MULTI FIELD MODE (ALL)');
    console.log('   Violation Conditions:', violationConditions);
    console.log('   Generated:', JSON.stringify(filter[arrayRoot], null, 2));

  });


    // =====================================================
    // 🔥 NEW RANGE MERGE SECTION (SAFE & ISOLATED)
    // =====================================================

    console.log('\n🔥 PROCESSING RANGE GROUPS');

    Object.entries(rangeGroups).forEach(([path, operators]) => {

      console.log('   Merging Range for:', path);
      console.log('   Operators:', operators);

      const arrayRoot = this.detectArrayRoot(path, model);

      if (arrayRoot) {

        const subPath = path.substring(arrayRoot.length + 1);

        filter[arrayRoot] = {
          $elemMatch: {
            [subPath]: operators
          }
        };

        console.log('   ✅ RANGE APPLIED INSIDE ARRAY');

      } else {

        filter[path] = operators;
        console.log('   ✅ RANGE APPLIED ON ROOT FIELD');
      }

    });

    console.log('\n🎯 FINAL FILTER GENERATED:');
    console.log(JSON.stringify(filter, null, 2));
    console.log('==============================\n');

    return filter;
  }

  // =========================
  // DETECT ARRAY ROOT
  // =========================
  static detectArrayRoot(path, model) {

    if (!model?.schema) {
      console.log('   ⚠ No model schema found');
      return null;
    }

    const parts = path.split('.');
    let currentPath = '';

    for (let i = 0; i < parts.length; i++) {

      currentPath = currentPath
        ? `${currentPath}.${parts[i]}`
        : parts[i];

      const schemaPath = model.schema.path(currentPath);

      console.log('      Checking schemaPath:', currentPath,
        schemaPath ? schemaPath.instance : 'NOT FOUND');

      if (schemaPath?.instance === 'Array') {
        console.log('      ✅ ARRAY ROOT FOUND:', currentPath);
        return currentPath;
      }
    }

    return null;
  }

  // =========================
  // RESOLVE CONDITION
  // =========================
  static resolveCondition(path, value, model) {

    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const schemaType = this.getSchemaType(path, model);

    if (schemaType) {
      return this.buildTypedCondition(value, schemaType);
    }

    return this.buildSmartCondition(value);
  }

  // =========================
  // SCHEMA DETECTION
  // =========================
  static getSchemaType(path, model) {

    if (!model?.schema) return null;

    const schemaPath = model.schema.path(path);

    if (!schemaPath) return null;

    return schemaPath.instance;
  }

  // =========================
  // TYPE-BASED CONDITION
  // =========================
  static buildTypedCondition(value, type) {

    switch (type) {

      case 'String':
        return this.buildStringCondition(value);

      case 'Number':
        return this.buildNumberCondition(value);

      case 'Date':
        return this.buildDateCondition(value);

      case 'ObjectID':
        return value;

      default:
        return value;
    }
  }

  // =========================
  // SMART FALLBACK
  // =========================
  static buildSmartCondition(value) {

    if (!isNaN(value) && value.trim() !== '') {
      return Number(value);
    }

    if (this.isISODate(value)) {
      return new Date(value);
    }

    return this.buildStringCondition(value);
  }

  static buildStringCondition(value) {
    return { $regex: value, $options: 'i' };
  }

  static buildNumberCondition(value) {
    return Number(value);
  }

  static buildDateCondition(value) {
    return new Date(value);
  }

  static isISODate(value) {
    return /^\d{4}-\d{2}-\d{2}/.test(value);
  }

}