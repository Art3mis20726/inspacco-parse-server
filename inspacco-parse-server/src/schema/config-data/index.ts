import { createDefaultConfig } from "./createDefaultConfig";
import { createDisplayIdCounterCollection } from "./createDisplayIdCounter";
import { createLookups } from "./createLookups";
import { createPermissions } from "./createPermissions";
import { createAdminRoles } from "./createRoles";
import { createServices } from "./createServices";
import { createSystemUsers } from "./createSystemUsers";

export const importConfigData = async()=>{
    await createAdminRoles();
    await createSystemUsers();
    await createDisplayIdCounterCollection();
    await createLookups();
    await createDefaultConfig();
    await createPermissions();
    await createServices();
};