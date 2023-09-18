import vue from 'vue'

function success(msg) {
    return vue.$notify({ title: vue.$t(msg), type: 'success' })
}

function error(msg) {
    return vue.$notify.error({ title: vue.$t(msg) })
}

function info(msg) {
    return vue.$notify.info({ title: vue.$t(msg) })
}

function notify(config) {
    return vue.$notify(config)
}

notify.success = success
notify.error = error
notify.info = info

export default notify
