const getSaveOrQueryOption = (user) => {
    let option = user && !user.useMasterKey
      ? { sessionToken: user.getSessionToken() }
      : { useMasterKey: true };
    return option;
  };
  const getSchemaQuery = (schemaname) => {
    return (queryObj, user) => {
      let query = getQuery(schemaname);
      Object.keys(queryObj).forEach((field) => {
        query.equalTo(field, queryObj[field]);
      });
      return query.first(getSaveOrQueryOption(user));
    };
  };
  const getSchemaFindQuery = (schemaname) => {
    return (queryObj, user) => {
      let query = getQuery(schemaname);
      Object.keys(queryObj).forEach((field) => {
        query.equalTo(field, queryObj[field]);
      });
      query.limit(1000);
      query.addDescending('createdAt');
      return query.find(getSaveOrQueryOption(user));
    };
  };
  function createRecord(schemaname) {
    return (obj, user) => {
      const Schema = Parse.Object.extend(schemaname);
      const schema = new Schema();
      return schema.save(obj, getSaveOrQueryOption(user));
    };
  }
  const getQuery = (schemaname) => {
    const Schema = Parse.Object.extend(schemaname);
    return new Parse.Query(Schema);
  };
  var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  
  const attachments = await getSchemaFindQuery('Attachment')({module:'Service_TaskActivity_Photos'});
  //console.log(attachments)
  const map = {};
  attachments.forEach(attachment=>{
    const parentId = attachment.get('parentId');
    if(map[parentId]){
       map[parentId].push(attachment);
    }else {
      map[parentId] = [attachment];
    }
  });
  for(let activityId in map){
     const taskActivity = await getSchemaQuery('TaskActivity')({objectId:activityId});
     const attachmentsRelation = taskActivity.relation('attachments');

    // Add the attachment to the relation
    attachmentsRelation.add(map[activityId]);
    console.log(taskActivity.get('attachments'));
    // await taskActivity.save(null,{useMasterKey:true});
  }
  