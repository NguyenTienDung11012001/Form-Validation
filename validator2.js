function Validator(formSelector) {
    var _this = this
    var formRules = {}

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    /*
        Quy ước tạo rules
        - Nếu có lỗi return `error message`
        - Nếu không có lỗi thì return `undefined`
    */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này!'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : "Vui lòng nhập đúng email"
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiếu ${min} ký tự`
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`
            }
        },
        confirmPassword: function (value) {
            var password = formElement.querySelector('#password').value
            return value == password ? undefined : 'Mật khẩu không khớp!'
        }
    }

    //Lấy ra form Element bằng formSelector 
    formElement = document.querySelector(formSelector)

    //Chỉ xử lý khi có element trong DOM
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')

        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|')

            for (var rule of rules) {
                var ruleInfor
                var ruleHasValue = rule.includes(':')

                if (ruleHasValue) {
                    ruleInfor = rule.split(':')
                    rule = ruleInfor[0]
                }

                var ruleFunc = validatorRules[rule]

                if (ruleHasValue) {
                    ruleFunc = ruleFunc(ruleInfor[1])
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                } else {
                    formRules[input.name] = [ruleFunc]
                }
            }
            //Lang nghe cac su kien de validate 
            input.onblur = handleValidate
            input.oninput = handleClearError

        }

        //Ham validate
        function handleValidate(event) {
            var rules = formRules[event.target.name]
            var errorMessage

            for (var rule of rules) {
                errorMessage = rule(event.target.value.trim())
                if (errorMessage) break;
            }

            //Neu co loi thi hien thi message loi ra UI
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group')

                if (formGroup) {
                    var formMessage = formGroup.querySelector(".form-message")

                    if (formMessage) {
                        formMessage.innerText = errorMessage
                        formGroup.classList.add('invalid')
                    }
                }
            }

            return !errorMessage

        }

        //Ham clear message loi 
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')

                var formMessage = formGroup.querySelector(".form-message")

                if (formMessage) {
                    formMessage.innerText = ''
                }
            }
        }
    }

    //Xu li hanh vi submit form 
    formElement.onsubmit = function (event) {
        event.preventDefault();

        _this.onSubmit();

        var inputs = formElement.querySelectorAll('[name][rules]')
        var isValid = true
        var formValues = {}

        for (var input of inputs) {
            if (!handleValidate({ target: input })) {
                isValid = false
            }
        }

        //Khi khong co loi thi submit form 
        if (isValid) {
            for (var input of inputs) {
                formValues[input.name] = input.value
            }

            if (typeof _this.onSubmit === 'function') {
                _this.onSubmit(formValues)
            } else {
                formElement.submit();
            }
        }
    }
}