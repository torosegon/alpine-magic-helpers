import Alpine from 'alpinejs'
import AlpineConfirmMagicMethod from '../dist/confirm'

beforeAll(() => {
    window.Alpine = Alpine
})

beforeEach(() => {
    AlpineConfirmMagicMethod.start()
})

test('$confirm > confirm is called', async () => {
    window.confirm = jest.fn(() => true)

    document.body.innerHTML = `
        <div x-data>
            <button @click="$confirm('message', () => true)"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    expect(window.confirm).toBeCalled()
})
