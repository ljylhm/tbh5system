import { httpPost } from '@/lib/http';

// 获取最新公告
export const getNewNotice = () => {
    return httpPost("/api/notice/latest",{
        type: 2
    })
}