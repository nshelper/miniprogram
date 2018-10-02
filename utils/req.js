let localUrl ="https://lab.zqyyh.com";

export function post (url,data) {
	return new Promise((resolve,reject)=> {
		wx.showNavigationBarLoading()
		wx.request({
			url: localUrl+url,
			data: data,
			method: "POST",
			header: {
        'auth':'struggler',
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res)=> {
				let title = res.data.message;
				if (title){
					wx.showToast({
					  title: title,
					  icon: 'success',
					  duration: 2000
					});
				}
				wx.hideNavigationBarLoading()
				resolve(res.data);
			},
			fail: (err)=> {
				wx.hideNavigationBarLoading()
				wx.showToast({
				  title: '获取数据失败',
				  icon: 'none',
				  duration: 2000
				});
				reject(err);
			}
		})
	})
}

export function get (url,data) {
	return new Promise((resolve,reject)=>{
		wx.showNavigationBarLoading()
		wx.request({
			url: localUrl+url,
			data: data,
			method: "GET",
			header: {
				'content-type': 'application/json'
			},
			success: (res)=> {
				let title = res.data.message;
				if (title){
					wx.showToast({
					  title: title,
					  icon: 'success',
					  duration: 2000
					});
				}
				wx.hideNavigationBarLoading()
				resolve(res.data);
			},
			fail: (err)=> {
				wx.hideNavigationBarLoading()
				reject(err);
				wx.showToast({
				  title: '获取数据失败',
				  icon: 'none',
				  duration: 2000
				});
			}
		})
		
	})
}
export function upload(url,path) {
	return new Promise((resolve,reject)=>{
		console.log(path);
		wx.showNavigationBarLoading()
		wx.uploadFile({
			url: localUrl+url,
			filePath: path,
			name: "image",
			formData: {
				"name":"image"
			},
			header: {
				'content-type': 'multipart/form-data'
			},
			success: (res)=> {
				wx.hideNavigationBarLoading()
				wx.showToast({
				  title: '上传图片成功',
				  icon: 'success',
				  duration: 2000
				});
				resolve(res.data);
			},
			fail: (err)=> {
				wx.hideNavigationBarLoading()
				wx.showToast({
				  title: '上传数据失败',
				  icon: 'none',
				  duration: 2000
				});
				reject(err);
			}
		});	
	})
}

export default {
	post,
	get,
	upload
}