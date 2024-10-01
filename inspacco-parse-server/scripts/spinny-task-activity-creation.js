const taskIds = ["16cwIIRRsf","1Qo9avTtEP","1SHYMi2rUF","1bR94mAjKv","3MxCpOAS7H","4CYGO1x3tY","4KPT6UeCih","4N2G6VSBSf","4rvFnCrb2E","5RIj7D18mB","7Vxm7b6AZk","7ibp9UoTSr","8hRsG2ZMTb","9lWKo7SgMI","9nyMIh01Vb","A6xqKo7VKK","A8orpORLVb","AMw6Fvq4rH","AveA7nRcrt","BEff4ZQ4Bm","C6sk5Fp2WM","CUs7TSeXS6","D2FEhusSjn","E2OCgA9SUa","Elr8v6HDRr","Esu4LkoTm9","EvaWtVGADn","FE6fni3qkm","FFzHb6nVLt","FTgOpfySPT","FUJdhWdFpM","Fcb41P0BG7","GzVfGZjvod","HLLTBTkvap","HPwlTifXGZ","HWasXg4MoV","Hg2jo1aEwe","HkbHhfkC3j","HyOu6VeoHb","Idj6PGbl4z","KTBZXgnJeY","LQjTkzs9MF","LZrpNilLS7","LwnbWDu6Pj","M8Vdnn17ff","MOSzaydgoA","NPICtBjeYt","O3HP7pIjph","PkGCV3iBJl","QYmErcLCRh","Rwc0vR6Fq9","SlMV7z0UxW","UEVXlDx0Wo","UgOInM0awe","VAJoVfwwtR","VIGzj0IzQ2","VIzW33jgCr","WaKMySlCGx","WrrkuwDA23","XFsM6ILiX3","Xlm5VTQLpC","YETeRuH9Co","Yn99PFQxIP","a7ahsT2obq","aCDWMc4iSF","b8X521NkGn","bZ0oAZT9l2","c76SbZmB0Y","d5A49xVCid","d7MEXaxEbb","dCdYnDMaED","dtlTHqAFF3","dvBQykw2m2","ed69O5I6pv","essVuK7ieN","ezVZ6PT2sW","f2HDdj2YP2","fWBmWgvHpC","frVtWkEYFp","gACnTBFw1Y","gf6UQWj1oH","hX7KQ8JLK6","jO7HVkBbF6","jUNx1cq1z3","jdy7QyUy9O","l9dBESGhaV","ljZWY0Zw4w","lk96ViIQyl","mMY5yvfubq","mQUCzp5AoL","mUQwhwMqyf","mhntkifV5d","mqDl5wccdG","nPkY3CqnVg","nyZ5MOInmQ","p8KmUGfutt","pDZytT4KsO","qkIMcztrLR","qx9Lnazd7y","rdFhN2VqmD","s5aVTCjtgJ","sU11tAmLLK","sWAN4qEnxC","szFdJmp43o","tpbbGSJ6ut","v2e7G8NGcE","v3DOlt0sY9","wtKvIoYc4k","wyXCynhZZ9","xATp3ZukOm","yCcCXCCyub","yMaurEQr8"];

for(let taskId of taskId){
    const task = await getSchemaQuery('Task')({objectId:taskId});
    const A = Parse.Object.extend('ServiceSubscription');
    const query = new Parse.Query(A);
    query.include('tasks');
    query.equalTo('tasks', task);
    const serviceSubscription = await query.first(getSaveOrQueryOption());
    console.log(serviceSubscription);
    const taskActivityObject = {
        taskDate:task.get('startDate'),
        task,
        serviceSubscription,
    };
}

return;

