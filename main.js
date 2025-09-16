let pressedEquals = false;
const operator = ['*', "+", "-", "÷", "%"];

// Action functions
const actions = {
    append: (btn, display) => {
        if (display.value === '0' || display.value === 'Error') {
            display.value = ''
        }
        
        if (pressedEquals) {
            
            if (operator.includes(btn.dataset.val)) {
                display.value += btn.dataset.val
                pressedEquals = false
                return
            }
            else {
                display.value = btn.dataset.val
                pressedEquals = false;
            }
        }else {
            if (operator.includes(btn.dataset.val)) {
                if (operator.includes(display.value.slice(-1))) {
                    display.value = display.value.slice(0, -1)
                    display.value += btn.dataset.val
                }else { 
                    if (display.value === '0' || display.value === '') {
                        display.value = '0'
                    }else {
                        display.value += btn.dataset.val
                    }
                }
            }else
                display.value += btn.dataset.val
        }
    },
    sign: (btn, display) => {
        if (display.value > 0)
            display.value *= -1
        else if (display.value < 0)
            display.value *= -1
    },
    decimal: (btn, display) => {
            if (!display.value.split(/[\+\-\*\/]/)[display.value.split(/[\+\-\*\/]/).length - 1].includes('.')) {
                if (display.value == "0") 
                    display.value = '0.'
                else {
                    display.value += '.'
                }
            }
    },
    equals: (btn, display) => {
        try {
            display.value = display.value.replace(/÷/g, '/');
            let result = eval(display.value)
            if(result !== Infinity) {       
                result = parseFloat(result)
                result = Math.round(result * 1000 ) / 1000
                display.value = result.toString();
            }else {
                display.value = 'Error'
            }
        } catch (e) {
            display.value = 'Error';
        }
        pressedEquals = true;
    },
    clear: (btn, display) => display.value = '0',
    backspace: (btn, display) => {
        if ( (display.value.charAt(0) === '-' && display.value.length == 2) || display.value === 'Error') {
            display.value = '0'
        }else
            if (display.value.length == 1) {
                display.value = '0'
            }else
                display.value = display.value.slice(0, -1)
    },
}

// DOM elements
const display = document.getElementById('display');
const buttons = document.querySelector('.calculator-buttons')


// Button support
buttons.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action && actions[action]) {
        actions[action](btn, display);
    }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;
    let btn = null;
    if ((key >= '0' && key <= '9') || operator.includes(key)) {
        btn = document.querySelector(`button[data-val="${key}"]`);
        actions.append(btn, display);
    } else if (key === 'Enter' || key === '=') {
        btn = document.querySelector('button[data-action="equals"]');
        actions.equals(btn, display);
    } else if (key === 'Backspace') {
        btn = document.querySelector('button[data-action="backspace"]');
        actions.backspace(btn, display);
    }   else if (key === 'Escape') {
        btn = document.querySelector('button[data-action="clear"]');
        actions.clear(btn, display);
    } else if (key === '.') {
        btn = document.querySelector('button[data-action="decimal"]');
        actions.decimal(btn, display);
    } else if (key === 'F9') {
        btn = document.querySelector('button[data-action="sign"]');
        actions.sign(btn, display);
    } else if (key === '/'){
        btn = document.querySelector('button[data-val="÷"]');
        actions.append(btn, display);
    }else if (key === '%'){
        btn = document.querySelector('button[data-val="%"]');
        actions.append(btn, display);
    }else {
        return;
    }
    e.preventDefault();
    btn.classList.add('active');
    setTimeout(() => {
        btn.classList.remove('active');
    }, 100);
});