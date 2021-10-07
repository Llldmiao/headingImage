// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

const getCollectionCount = async () => {
  const count = await db.collection('data').count();
  return Number(count.total);
}

const getUserNum = async (openid) => {
  const postNum = await db.collection('data').where({ _openid: openid }).get();
  return postNum.data;
}

const addPostNum = async (openid) => {
  let count = await getCollectionCount();
  let postNum = (count + 1).toString().padStart(6, 0);
  await db.collection('data').add({
    data: {
      _openid: openid,
      postNum: postNum
    }
  })
  return postNum
}
/*返回邮编号
*查找集合中openid为当前openid的数据，
*若数据存在，返回其postNum
*否则，插入一条数据，openid为当前openid，postNum为集合长度+1,然后返回postNum;
*/
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let user = await getUserNum(wxContext.OPENID);
  if(user.length == 0){
    //插入数据
    var add = await addPostNum(wxContext.OPENID);
    user = await getUserNum(wxContext.OPENID)
  }
  return user[0].postNum;
}

