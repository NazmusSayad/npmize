console.clear()
const TEST_TARGET = '../rype'
import { app } from '../app'
import '../main'

// app.start(['init', TEST_TARGET])
// app.start(['dev', TEST_TARGET])
app.start(['build', TEST_TARGET])
