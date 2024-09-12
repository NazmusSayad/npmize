console.clear()

import { app } from '../app'
import '../main'

// app.start(['init', '../npmize-test'])
app.start(['dev', '../npmize-test', '--module', 'mjs'])
// app.start(['build', '../npmize-test'])
