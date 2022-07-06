(function ($) {
    $.extend($.fn, {
        validate: function (name, required, options) {
            var validator = new $.validator(name, required, options, this[0]);
            return $.validator.result;
        }
    });

    $.validator = function (name, required, options, element) {

        // 스크립트 오류 #1 - 옵션 미지정
        if (!name) {
            window.alert("[스크립트 오류] 옵션에서 이름이 지정되지 않았습니다.");
            $.validator.result = false;
            return false;
        }

        // 스크립트 오류 #2 - 대상 오브젝트 없음
        if (!element) {
            window.alert("[스크립트 오류] 해당 오브젝트를 찾을 수 없습니다.");
            $.validator.result = false;
            return false;
        }

        $.validator.result = this.check(name, required, options, element);

        if (!$.validator.result && $(element).is(":visible")) {
            element.focus();
        }

        return true;

    };

    $.extend($.validator, {

        result: true,

        messages: {
            requireWritable: "{을를} 입력해 주세요.",
            requireCheckable: "{을를} 선택해 주세요.",

            alpha: "{은는} 영문으로 입력해 주세요.",
            numeric: "{은는} 숫자로 입력해 주세요.",
            alphaNumeric: "{은는} 영문 또는 숫자로 입력해 주세요.",
            pwdValidation: "{은는} 6자 이상의 영문 소문자, 숫자로 입력해 주세요.",
            hangul: "{은는} 한글로 입력해 주세요.",

            rangeValue: "{은는} {0} 이상 {1} 이하로 입력해 주세요.",
            minValue: "{은는} 최소 {0} 이상으로 입력해 주세요.",
            maxValue: "{은는} 최대 {0} 이하로 입력해 주세요.",

            rangeLength: "{은는} {0}자 이상 {1}자 이하로 입력해 주세요.",
            minLength: "{은는} {0}자 보다 같거나 크게 입력해 주세요.",
            maxLength: "{은는} {0}자 보다 같거나 작게 입력해 주세요.",

            exactLength: "{은는} {0}자로 입력해 주세요.",

            image: "{은는} JPG, GIF, PNG만 등록 가능합니다.",
            email: "{이가} 형식에 맞지 않습니다.",
            emailChk: "{이가} 형식에 맞지 않습니다.",
            phone: "{이가} 형식에 맞지 않습니다.",
            mobile: "{이가} 형식에 맞지 않습니다.",
            url: "{이가} 형식에 맞지 않습니다.",
            date: "{이가} 형식에 맞지 않습니다.",

            koreanSSN: "{이가} 형식에 맞지 않습니다.",
            foreignSSN: "{이가} 형식에 맞지 않습니다.",
            businessSSN: "{이가} 형식에 맞지 않습니다.",
            corporateSSN: "{이가} 형식에 맞지 않습니다."

        },

        prototype: {

            writable: function (element) {
                return /input|textarea/i.test(element.nodeName.toLowerCase()) && !/radio|checkbox/i.test(element.type);
            },

            checkable: function (element) {
                return /radio|checkbox/i.test(element.type);
            },

            selectable: function (element) {
                return /select/i.test(element.nodeName.toLowerCase());
            },

            findByName: function (element) {
                return $(document.getElementsByName(element.name));
            },

            check: function (name, required, options, element) {

                if (required && $.validator.methods.blank(element)) {
                    if (this.writable(element)) {
                        this.showError(name, $.validator.messages.requireWritable);
                    } else if (this.checkable(element) || this.selectable(element)) {
                        this.showError(name, $.validator.messages.requireCheckable);
                    }
                    return false;
                }

                for (option in options) {

                    if (!$.validator.methods[option]) {
                        window.alert("[스크립트 오류] " + option + " 옵션을 찾을 수 없습니다.");
                        return false;
                    }

                    // 옵션 검사
                    var valid = $.validator.methods[option].call(this, element, options[option]);

                    // 필수 조건과 옵션 검사 결과를 조합해서 최종 판정을 한다.
                    if ((required && !valid) || (!required && !$.validator.methods.blank(element) && !valid)) {
                        this.showError(name, $.validator.format($.validator.messages[option], options[option]));
                        return false;
                        break;
                    }

                }

                return true;
            },

            showError: function (name, msg) {
                var pattern = /{([가-힣]{2})?}/; pattern.exec(msg);
                var postposition = this.hasFinalConsonant(name) ? RegExp.$1.substring(0, 1) : RegExp.$1.substring(1, 2);
                window.alert(msg.replace(pattern, name + postposition));
            },

            hasFinalConsonant: function (str) {
                return ((str.substr(str.length - 1).charCodeAt(0) - 16) % 28 != 0) ? true : false;
            },

            getLength: function (element) {
                switch (element.nodeName.toLowerCase()) {
                    case 'select':
                        return $("option:selected", element).length;
                    case 'input':
                        if (this.checkable(element))
                            return this.findByName(element.name).filter(':checked').length;
                }
                return element.value.length;
            },

            objectLength: function (obj) {
                var count = 0;
                for (var i in obj)
                    count++;
                return count;
            }
        },

        methods: {

            blank: function (element) {
                if ($.validator.prototype.writable(element) || $.validator.prototype.selectable(element)) {
                    return !$.trim("" + element.value);
                } else if ($.validator.prototype.checkable(element)) {
                    return $.validator.prototype.findByName(element).filter(":checked").length == 0 ? true : false;
                }
            },

            alpha: function (element, param) {
                return (/^[a-zA-Z]+$/).test(element.value);
            },

            numeric: function (element, param) {
                return (/^[0-9]+$/).test(element.value);
            },

            alphaNumeric: function (element, param) {
                return (/^[0-9a-zA-Z]+$/).test(element.value);
            },

            pwdValidation: function (element, param) {
                return (/^[0-9a-z]+$/).test(element.value);
            },

            hangul: function (element, prarm) {
                return (/^[가-힣]+$/).test(element.value);
            },

            rangeValue: function (element, param) {
                return (element.value >= param[0] && element.value <= param[1]);
            },

            minValue: function (element, param) {
                return (element.value >= param);
            },

            maxValue: function (element, param) {
                return (element.value <= param);
            },

            rangeLength: function (element, param) {
                var length = $.validator.prototype.getLength(element);
                return (length >= param[0] && length <= param[1]);
            },

            minLength: function (element, param) {
                return $.validator.prototype.getLength(element) >= param;
            },

            maxLength: function (element, param) {
                return $.validator.prototype.getLength(element) <= param;
            },

            exactLength: function (element, param) {
                return $.validator.prototype.getLength(element) == param;
            },

            image: function (element) { // contributed by Scott Gonzalez: http://tools.netshiftmedia.com/regexlibrary/
                //파일명 영문 + 0~9
                //return /^[a-zA-Z0-9-_:\\.]+\.(jpg|gif|png|JPG|GIF|PNG)$/.test(element.value);
                //확장자만
                return /^^.+\.(jpg|gif|png|JPG|GIF|PNG)$/.test(element.value);
            },

            email: function (element) { // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return /^((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(element.value);
            },

            emailChk: function (element) { // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(element.value);
            },

            url: function (element) { // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(element.value);
            },

            phone: function (element) {
                return /^(02|0[3-7]{1}[0-9]{1})-[1-9]{1}[0-9]{2,3}-[0-9]{4}$/.test(element.value);
            },

            mobile: function (element) {
                return /^01[016789][1-9]{1}[0-9]{2,3}[0-9]{4}$/.test(element.value);
            },

            date: function (element) {
                // 형식 검사
                if (!/^\d{4}[\-\/\s\.]?((((0[13578])|(1[02]))[\-\/\s\.]?(([0-2][0-9])|(3[01])))|(((0[469])|(11))[\-\/\s\.]?(([0-2][0-9])|(30)))|(02[\-\/\s\.]?[0-2][0-9]))$/.test(element.value)) {
                    return false;
                }

                // 형식 추가 검사 (2월 일 때)
                var date = element.value.replace(/[\-\/\s\.]/g, "");
                if (date.substr(4, 2) == "02") {
                    var year = date.substr(0, 4);
                    if (date.substr(6, 2) == "29") {
                        if (!((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0))) {
                            return false;
                        }
                    }
                }
                return true;
            },

            koreanSSN: function (element) {
                // 형식 검사
                if (!/^[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}[\-]?[1234]{1}[0-9]{6}$/.test(element.value)) {
                    return false;
                }

                var ssn = element.value.replace(/[\-]/g, "");

                // 생년월일 검사
                if (!/^\d{2}((((0[13578])|(1[02]))(([0-2][0-9])|(3[01])))|(((0[469])|(11))(([0-2][0-9])|(30)))|(02[0-2][0-9]))$/.test(ssn.substr(0, 6))) {
                    return false;
                }

                // 생년월일 추가 검사 (2월 일때)
                if (ssn.substr(2, 2) == "02") {
                    var year = parseInt(ssn.charAt(6)) == (1 || 2) ? "19" + ssn.substr(0, 2) : "20" + ssn.substr(0, 2);
                    if (ssn.substr(4, 2) == "29") {
                        if (!((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0))) {
                            return false;
                        }
                    }
                }

                // 규칙 검사
                var sum = 0;
                var num = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
                var last = parseInt(ssn.charAt(12));
                for (var i = 0; i < 12; i++) {
                    sum += parseInt(ssn.charAt(i)) * num[i];
                }
                return ((11 - sum % 11) % 10 == last) ? true : false;
            },

            foreignSSN: function (element) {
                // 형식 검사
                if (!/^[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}[\-]?[5678]{1}[0-9]{1}[02468]{1}[0-9]{2}[6789]{1}[0-9]{1}$/.test(element.value)) {
                    return false;
                }

                var ssn = element.value.replace(/[\-]/g, "");

                // 생년월일 검사
                if (!/^\d{2}((((0[13578])|(1[02]))(([0-2][0-9])|(3[01])))|(((0[469])|(11))(([0-2][0-9])|(30)))|(02[0-2][0-9]))$/.test(ssn.substr(0, 6))) {
                    return false;
                }

                // 생년월일 추가 검사 (2월 일때)
                if (ssn.substr(2, 2) == "02") {
                    var year = parseInt(ssn.charAt(6)) == (1 || 2) ? "19" + ssn.substr(0, 2) : "20" + ssn.substr(0, 2);
                    if (ssn.substr(4, 2) == "29") {
                        if (!((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0))) {
                            return false;
                        }
                    }
                }

                // 규칙검사
                if ((parseInt(ssn.charAt(7)) * 10 + parseInt(ssn.charAt(8))) % 2 != 0) {
                    return false;
                }
                var sum = 0;
                var num = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
                var last = parseInt(ssn.charAt(12));
                for (var i = 0; i < 12; i++) {
                    sum += parseInt(ssn.charAt(i)) * num[i];
                }
                return (((11 - sum % 11) % 10) + 2 == last) ? true : false;
            },

            businessSSN: function (element) {
                // 형식 검사
                if (!/^[0-9]{3}[\-]?[0-9]{2}[\-]?[0-9]{5}$/.test(element.value)) {
                    return false;
                }

                var ssn = element.value.replace(/[\-]/g, "");

                // 규칙검사
                var sum = parseInt(ssn.charAt(0));
                var num = [0, 3, 7, 1, 3, 7, 1, 3];
                for (var i = 1; i < 8; i++) sum += (parseInt(ssn.charAt(i)) * num[i]) % 10;
                sum += Math.floor(parseInt(parseInt(ssn.charAt(8))) * 5 / 10);
                sum += (parseInt(ssn.charAt(8)) * 5) % 10 + parseInt(ssn.charAt(9));
                return (sum % 10 == 0) ? true : false;
            },

            corporateSSN: function (element) {
                // 형식 검사
                if (!/^[0-9]{6}[\-]?[0-9]{7}$/.test(element.value)) {
                    return false;
                }

                var ssn = element.value.replace(/[\-]/g, "");

                // 규칙검사
                var sum = 0;
                var num = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
                var last = parseInt(ssn.charAt(12));
                for (var i = 0; i < 12; i++) {
                    sum += parseInt(ssn.charAt(i)) * num[i];
                }
                return ((10 - sum % 10) % 10 == last) ? true : false;
            }
        }

    });

    $.validator.format = function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    };

})(jQuery);
