import {
    checkForAlpine,
    objectSetDeep,
    componentData,
    syncWithObservedComponent,
    updateOnMutation,
    waitUntilReady,
} from './utils'

const AlpineComponentMagicMethod = {
    start() {
        checkForAlpine()

        Alpine.addMagicProperty('parent', ($el) => {
            if (typeof $el.$parent !== 'undefined') return $el.$parent

            const parentComponent = $el.parentNode.closest('[x-data]')
            if (!parentComponent) throw new Error('Parent component not found')

            // If the parent component is not ready, we return a dummy proxy
            // that always prints out an empty string and we check again on the next frame
            // We are de facto deferring the value for a few ms but final users
            // shouldn't notice the delay
            return waitUntilReady(parentComponent, $el, () => {
                $el.$parent = syncWithObservedComponent(componentData(parentComponent), parentComponent, objectSetDeep)
                updateOnMutation(parentComponent, () => {
                    $el.$parent = syncWithObservedComponent(parentComponent.__x.getUnobservedData(), parentComponent, objectSetDeep)
                    $el.__x.updateElements($el)
                })
                return $el.$parent
            })
        })

        Alpine.addMagicProperty('component', ($el) => {
            return function (componentName) {
                if (typeof this[componentName] !== 'undefined') return this[componentName]

                const componentBeingObserved = document.querySelector(`[x-data][x-id="${componentName}"], [x-data]#${componentName}`)
                if (!componentBeingObserved) throw new Error('Component not found')

                // If the observed component is not ready, we return a dummy proxy
                // that always prints out an empty string and we check again on the next frame
                // We are de facto deferring the value for a few ms but final users
                // shouldn't notice the delay
                return waitUntilReady(componentBeingObserved, $el, () => {
                    this[componentName] = syncWithObservedComponent(componentData(componentBeingObserved), componentBeingObserved, objectSetDeep)
                    updateOnMutation(componentBeingObserved, () => {
                        this[componentName] = syncWithObservedComponent(componentBeingObserved.__x.getUnobservedData(), componentBeingObserved, objectSetDeep)
                        $el.__x.updateElements($el)
                    })
                    return this[componentName]
                })
            }
        })
    },
}

const alpine = window.deferLoadingAlpine || ((alpine) => alpine())

window.deferLoadingAlpine = function (callback) {
    alpine(callback)

    AlpineComponentMagicMethod.start()
}

export default AlpineComponentMagicMethod
