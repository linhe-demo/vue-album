function isMobile() {

    return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}

function currentYear() {
    return new Date().getFullYear()
}

export default {
    isMobile,
    currentYear
}
