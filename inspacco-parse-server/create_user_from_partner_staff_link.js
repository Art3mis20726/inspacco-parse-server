const ROLES = {
  INSPACCO_ADMIN:'INSPACCO_ADMIN',
  INSPACCO_KAM:'INSPACCO_KAM',
  PARTNER_STAFF:'PARTNER_STAFF',
  PARTNER_ADMIN:'PARTNER_ADMIN',
  PARTNER_KAM:'PARTNER_KAM'
};

function getRoleByName(roleName){
  const q = new Parse.Query(Parse.Role);
  q.equalTo("name", roleName);
  return q.first({useMasterKey: true});
}
const getSaveOrQueryOption = (user)=>{
  let option = user && !user.useMasterKey
  ? { sessionToken: user.getSessionToken() }
  : { useMasterKey: true }; 
  return option;
};
const getSchemaQuery = (schemaname) => {
  return (queryObj, user) => {
    let query = getQuery(schemaname);
    Object.keys(queryObj).forEach(field => {
      query.equalTo(field, queryObj[field]);
    });
    return query.first(getSaveOrQueryOption(user));
  };
};
const getSchemaFindQuery = (schemaname,limit=100) => {
  return (queryObj, user) => {
    let query = getQuery(schemaname);
    Object.keys(queryObj).forEach(field => {
      query.equalTo(field, queryObj[field]);
    });
    query.limit(limit);
    return query.find(getSaveOrQueryOption(user));
  };
};
function createRecord(schemaname) {
  return (obj,user) => {
    const Schema = Parse.Object.extend(schemaname);
    const schema = new Schema();
    return schema.save(obj, getSaveOrQueryOption(user));
  };
}
const getQuery = (schemaname)=>{
  const Schema = Parse.Object.extend(schemaname);
  return new Parse.Query(Schema);
};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const partnerStaffs = await getSchemaFindQuery('PartnerStaff',3000)({status:'Active'});

for(const partnerStaff of partnerStaffs){
 const mobileNumber = partnerStaff.get('mobileNumber');
 let user = await getSchemaQuery('_User')({mobileNumber:mobileNumber});
 if(user){
   console.log('mobileNumber',mobileNumber);
    setAcl(user,partnerStaff.attributes.partner.id);
    console.log('ACL=>',user.getACL());
    await user.save(null,{useMasterKey:true});
 }              
}
async function findUserRoles(user){
  if(user){
    const q = new Parse.Query(Parse.Role);
    q.equalTo("users", user);

    const userRole = await q.find();
    if(userRole){
    return userRole;
  }
}   
return null;
}
async function setAcl(user,partnerID){
  console.log('partnerId',partnerID);
//console.log('setAcl',user.getACL())
  const acl = user.getACL();
  const userRoles = await findUserRoles(user);
  const partnerStaffRole = userRoles.find((role)=>{
     const roleName = role.get('name');
     return roleName.includes(ROLES.PARTNER_STAFF+'__');
  });
  //console.log("partnerStaffRole",partnerStaffRole)
  if(partnerStaffRole){
    const roleName = partnerStaffRole.get('name');
    const [role,partnerId] = roleName.split('__');
    acl.setRoleWriteAccess(ROLES.PARTNER_ADMIN+'__'+partnerId, true);
    acl.setRoleWriteAccess(ROLES.PARTNER_KAM+'__'+partnerId,true);
  }else if(partnerID){
    acl.setRoleWriteAccess(ROLES.PARTNER_ADMIN+'__'+partnerID, true);
    acl.setRoleWriteAccess(ROLES.PARTNER_KAM+'__'+partnerID,true);
  }
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM,true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_ADMIN,true);
  acl.setWriteAccess(user,true);
  acl.setPublicReadAccess(true);
  user.setACL(acl);

}
