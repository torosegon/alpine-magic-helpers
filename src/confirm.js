import { checkForAlpine } from './utils'

const AlpineConfirmMagicMethod = {
    start() {
        checkForAlpine()

        Alpine.addMagicProperty('confirm', () => {
            return function (message, callback) {
                if (confirm(message)) {
                    callback()
                }
            }
        })
    },
}

const alpine = window.deferLoadingAlpine || ((alpine) => alpine())

window.deferLoadingAlpine = function (callback) {
    AlpineConfirmMagicMethod.start()

    alpine(callback)
}

export default AlpineConfirmMagicMethod
