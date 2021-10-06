// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

const getCollectionCount = async () => {
  const count = await db.collection('data').count();
  return count.total;
}

const getPostNum = async (openid) => {
  const postNum = await db.collection('data').where({_openid: openid}).get();
  return postNum.data;
}
/*返回邮编号
*查找集合中openid为当前openid的数据，
*若数据存在，返回其postNum
*否则，插入一条数据，openid为当前openid，postNum为集合长度+1,然后返回postNum;
*/
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let user = getPostNum(wxContext.OPENID);
 
  if(user.length > 0){
    //插入数据
    let count = getCollectionCount();
    await db.collection('data').add({
      data: {
        openid: '{openid}',
        postNum: (count+1).toFixed(6)
      }
    })
    user = getPostNum(wxContext.OPENID);
  }
  return user;
}

