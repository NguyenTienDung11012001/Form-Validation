//Doi tuong validator
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}

    //Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorMessage
        var errorElement = getParent(inputElement, options.formGroupSlector).querySelector(options.errorSelector)

        //Lay ra cac rule cua selector
        var rules = selectorRules[rule.selector]

        //Lap qua tung rule va kiem tra
        //Neu co loi thi dung viec kiem tra f
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](inputElement.value)
                    break;
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage) {
            getParent(inputElement, options.formGroupSlector).classList.add('invalid')
            errorElement.innerText = errorMessage
        } else {
            getParent(inputElement, options.formGroupSlector).classList.remove('invalid')
            errorElement.innerText = ''
        }
        return !errorMessage
    }

    //Lay element cua form can validate
    var formElement = document.querySelector(options.form)
    // Khi submit form 
    if (formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault()

            var isFormInvalid = true
            //Lap qua tung rule va validate 
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector)
                var isInvalid = validate(inputElement, rule)
                if (!isInvalid) {
                    isFormInvalid = false
                }
            })

            if (isFormInvalid) {
                //Submit voi js 
                if (typeof options.onSubmit === 'function') {
                    var enableIput = formElement.querySelectorAll('[name]:not([disable])')
                    var formValues = Array.from(enableIput).reduce(function (values, input) {
                        values[input.name] = input.value
                        return values
                    }, {})
                    options.onSubmit(formValues)
                }
                //Submit mac dinh 
                else {
                    formElement.submit()
                }
            }
        }

    }
    //Lap qua cac rule va xu li (blue, input,...)
    options.rules.forEach(function (rule) {
        //Luu lai cac rules cho moi input
        if (Array.isArray(selectorRules[rule.selector])) {
            selectorRules[rule.selector].push(rule.test)
        } else {
            selectorRules[rule.selector] = [rule.test]
        }

        var inputElement = formElement.querySelector(rule.selector)
        var errorElement = getParent(inputElement, options.formGroupSlector).querySelector(options.errorSelector)

        if (inputElement) {
            //Xu li truong hop blur ra ngoai
            inputElement.onblur = function () {
                validate(inputElement, rule)
            }

            //Xu li moi khi nguoi dung nhap 
            inputElement.oninput = function () {
                getParent(errorElement, options.formGroupSlector).classList.remove('invalid')
                errorElement.innerText = ''
            }
        }
    })
}
// Dinh nghia rules
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này"
        }
    }
}
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : "Vui lòng nhập đúng email"
        }
    }
}
Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
} 