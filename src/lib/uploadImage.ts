import { getToken } from '@/lib/cache';
import { httpGet,httpPost } from '@/lib/http'

// 上传图片的借口
const token = getToken()
export const upLoadImage = (file:File) =>{
   const formData = new FormData();
   formData.append("type","image")
   // formData.append("token",token || "")
   formData.append("file",file)
   return httpPost<{
      src:string
   }>(`/api/upload`,formData,{
        "content-type": "multipart/form-data"
   })
}