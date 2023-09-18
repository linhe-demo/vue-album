import {ElMessage} from "element-plus";
let messageInstance = null;

export function isMobile() {
    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

export function currentYear() {
    return new Date().getFullYear()
}

export function notify(type, message) {
    console.log(message)
    ElMessage({
        message: message,
        type: type,
    });
    let el = document.querySelector('.el-message')
    if (el) el.style.cssText = 'position: absolute;margin-top: 60px;color:white;background-color:white;'
}

const resetMessage = (options) => {
    if (messageInstance) {
        messageInstance.close();
    }
    messageInstance = ElMessage(options);
};
['error', 'success', 'info', 'warning'].forEach((type) => {
    resetMessage[type] = (options) => {
        if (typeof options === 'string') {
            options = {
                message: options,
            };
        }
        options.type = type;
        return resetMessage(options);
    };
});

export const Message = (type, payload, duration, offset) => {
    resetMessage[type]({
        'message': payload,
        'custom-class': 'className',
        'offset': offset || 56,
        'duration': duration || 2000,
        'appendTo': document.getElementsByClassName('className')[0]
    });
};
