
// 初始化课表列表
function classInit (){
  const classlist = [[],[],[],[],[],[],[]]
  classlist.forEach((item,index)=>{
    for (let x=0 ;x<5; x++){
      item.push([])
    }
  })
  return classlist
}

//分类添加数据
export function classList (classInfo){
  //这是一个bug哦!
  let classlist = classInit()
  classInfo.forEach((item,index)=>{
    let n = item.kcid.split("_")[6]-1
    let nin = item.kcid.split("_")[8]/2-1
    classlist[n][nin].push(item)
    if (item.kcid.split("_")[9]) {
      let nins = Math.floor(item.kcid.split("_")[9]/2)
      classlist[n][nins].push(item)
    }

  })
  // let classList = classInfo[0].kcid.split("_")
  return (classlist);

}

export function nowTime (){
  let date = new Date()
  let FullYear = date.getFullYear()
  let Day = date.getDate()
  let Month = date.getMonth() +1
  let Today = date.getDay() != 0? date.getDay()-1: date.getDay()+6
  Day = Day>=10?Day:'0'+Day
  Month = Month>=10?Month:'0'+Month
  let result = `${FullYear}-${Month}-${Day}`
  return [result,Today]
}

export default {
  classList,
  nowTime
}
