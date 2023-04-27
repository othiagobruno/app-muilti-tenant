import {tenants} from '../configs/tenants.js';

export const getConfig = (tenant_name) => {
  if (tenants[tenant_name]) {
    return tenants[tenant_name];
  } else {
    console.error(
      `Config tenant ${tenant_name} not found in config/index.js file`,
    );
    process.exit(1);
  }
};
