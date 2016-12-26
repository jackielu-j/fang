// JavaScript Document
//计算月还款本息的工具对象
var loanTool = {
    /**
     * 计算并返回月还款本息的方法(返回“月均还款”值)
     * @param loanAmount            贷款本金(也就是贷了多少款-贷款总额，比如，70万)
     * @param months                还款月数(也就是贷款周期，如20年，则此处为240个月)
     * @param annualInterestRate    年利率(比如，6.55%，则此处传入为6.55,应除以100以后转为0.0665再进行计算)
     */
    getPaymentsPerMonth: function (loanAmount, months, annualInterestRate) {
        // 等额本息还款法计算公式：
        // -- 月还款本息=〔贷款本金×月利率×（1＋月利率）＾还款月数〕÷〔（1＋月利率）＾还款月数－1〕
        // -- 月利率=年利率÷12=0.0665÷12=0.005541667
        // -- 其中＾符号表示乘方
        var rateOfMonth = annualInterestRate / (12 * 100);
        // 将计算所得的月还款金额(本息)返回
        return (loanAmount * rateOfMonth * Math.pow((1 + rateOfMonth), months)) / (Math.pow((1 + rateOfMonth), months) - 1);
    }
};

var my={
    //选项卡-----------------------------------------------------
    'tab': function () {
        $('.nav').find('li').each(function (index, element) {
            $(this).on('click', function () {
                $(this).addClass('ac').siblings().removeClass('ac');//给自己添加ac，移除兄弟元素的ac
                $('.cont').children().eq(index).css('display','block').siblings().css('display','none');//让对应的内容显示，隐藏兄弟内容
            })
        })
    },
    //计算方式选择-----------------------------------------------------
    'calcWays': function () {
        $('input[name="calc"]').each(function (index, element) {
            $(this).on('change', function () {
                $('.calcWay').css('display','none');//先隐藏所有计算方式
                $('.calc').find('.calcWay').eq(index).css('display','block');//显示对应的计算方式
            })
        })
    },
    //输入验证-----------------------------------------------------
    'input_alidation': function () {
        $('.calcWay').find('input').each(function (index, element) {
            $(this).on('blur', function () {//失去焦点事件
                var txt=$(this).val();
                if($.isNumeric(txt)==true){//判断是否是数字
                    $('.calcWay').find('span').eq(index).css('display','none');
                }else{
                    $('.calcWay').find('span').eq(index).css('display','block');
                };
            })
        });
    },
    //不同贷款类型的贷款利率-------------------------------------------
    'loanRate': function () {
        function getRate(loanType,years,option){
            var loanRate = {
                "商业贷款":{"1-5年":[5.75,6.02,6.34,6.65],"5-30年":[1.22,2.33,3.44,4.55]},// 商业贷款利率，不同日期的贷款利率
                "公积金贷款":{"3-5年":[1.01,2.02,3.03,4.05],"6-30年":[1.02,2.03,3.04,4.05]} // 公积金贷款利率，不同日期的贷款利率
            };
            return loanRate[loanType][years][option];
        };
        //贷款方式
        function selRate(){
            //获取贷款类别
            var Type=$('input[name="type"]:checked').val();
            //获取贷款年数
            var year;
            var y=parseInt($('#year').val());
            if(y>=1 && y<=5 && Type=='商业贷款'){year='1-5年'};
            if(y>=3 && y<=5 && Type=='公积金贷款'){year='3-5年'};
            if(y>5 && y<=30 && Type=='商业贷款'){year='5-30年'};
            if(y>5 && y<=30 && Type=='公积金贷款'){year='6-30年'};
            //获取贷款利率日期
            var option=$('.rate select option:selected').index();
            //得到利率
            $('#rate').val(getRate(Type,year,option));
        };

        $('input[name="type"]').on('change', function () {//选择贷款类别
            selRate();
        });
        $('.rate select').on('change',function () {//选择贷款利率日期
            selRate();
        });
        $('#year').on('change', function () {//选择贷款年数
            selRate();
        });
    },
    //开始计算----------------------------------------------------------
    'calc': function () {
        $('#calcBtn').on('click', function () {
            var loanAmount;
            if($('input[name="calc"]:checked').val()=='areaPrice'){
                loanAmount=$('#unitPrice').val()*$('#area').val()*parseInt($('.percent select').val());
                //房款总额
                $('#result').find('input').eq(0).val(loanAmount);
            };
            if($('input[name="calc"]:checked').val()=='total'){
                loanAmount=$('#total').val();
                //房款总额
                $('#result').find('input').eq(0).val('$');
            };
            //获取期数-------------------------
            var txt=$('#year').val();
            var re=/\D+\d*/;
            var txt2=String(txt.match(re));
            var re2=/\d+/;
            var txt3=txt2.match(re2)
            var months=parseInt(txt3);
            //--------------------------------
            var annualInterestRate=$('#rate').val()/100;
            var result=loanTool.getPaymentsPerMonth(loanAmount, months, annualInterestRate);//调用loanTool里的方法
            //贷款总额
            $('#result').find('input').eq(1).val(loanAmount);
            //还款总额
            $('#result').find('input').eq(2).val(parseInt(result)*months);
            //支付利息款
            $('#result').find('input').eq(3).val(parseInt(result)*months-loanAmount);
            //首期付款
            $('#result').find('input').eq(4).val(parseInt(loanAmount*0.3));
            //贷款月数
            $('#result').find('input').eq(5).val(months);
            //月均还款
            $('#result').find('input').eq(6).val(parseInt(result));
        })
    }
};

$(function () {
    my.tab();
    my.calcWays();
    my.input_alidation();
    my.loanRate();
    my.calc();
})




















