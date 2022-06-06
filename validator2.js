function Validator(formSelector) {
    var formRules = {}

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
        }
        console.log(formRules)
    }
}