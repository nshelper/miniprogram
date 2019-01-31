export function markers (longitude,latitude,content,type,id) {
  return {
    iconPath: "/images/common/position.png",
        id: id,
        latitude: latitude,
        longitude: longitude,
        width:25,
        height:25,
        alpha:0.8,
        title:"",
        callout:{
          content:content,
          borderRadius:12,
          color:"#fff",
          textAlign:"center",
          fontSize:10,
          bgColor: type == "saihan" ? "#fd4203" :"#0BA1F9",
          display:"ALWAYS",
          padding:5
        }
    }
}