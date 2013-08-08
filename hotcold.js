$(document).ready(function() {
    /* clicks Play game */
    $("#btnplay").on("click", function() {
        togglearea(true);
        setRangeDisplay(_range.low, _range.high, true);
        showRange();
    });
    
    /* selects a range and locks it in */
    $("#btnrange").on("click", function() {
        var inlow = $("#inlow").val();
        var inhigh = $("#inhigh").val();
        setRange(inlow, inhigh);
        setRangeDisplay(inlow, inhigh, false);
        
        showGuess();
    });
    
    /* clicks a guessed number */
    $("#btnguess").on("click", function() {
        var guess = $("#inguess").val();
        var gstat = calcStatus(_range.low, _range.high, _range.target, guess);
        var direction = calcDirection(_range.target, guess);
        setResponse(guess, gstat, direction);
        
        showResponse();
        if (gstat == _STATUS[3]) {
            toggleMessage(true);
        }
    });
    
    //$("input").keyup(function(event) {
    //    if(event.keyCode == 13){
    //        var prev = $(this).val();
    //        if (!$.isNumeric($(this).val())) {
    //            $(this).text(prev);
    //        }
    //    }
    //});
    
    // controls ENTER button events on input boxes
    $("#inguess").keyup(function(event){
        if(event.keyCode == 13){
            $("#btnguess").click();
        }
    });
    
    /* Range object */
    function GuessRange(low, high, target) {
        this.low = low;
        this.high = high;
        this.target = target;
    }
    _range = new GuessRange(0, 50, 25);

    function setRange(low, high) {
        _range.low = low;
        _range.high = high;
        _range.target = setTarget(low, high);
    }
    
    function setTarget(low, high) {
        var target = randomizeTarget(low, high);
        return target; /* JIC we want a separate function */
    }
    
    /* General data and utils */
    var _STDDEV = 0.001;
    var _WARMSTAT = 0.20;
    var _HOTSTAT = 0.10;
    var _STATUS = ["Cold", "Warm", "Hot", "**BINGO**"];
    var _DIR = ["Higher", "Lower", "**BINGO**"];
    var _RESET = "Replay >>>";
    function DIFF(val1, val2, stddev) {
        return (Math.abs(val1-val2) <= stddev);
    }
    function EQU(val1, val2) {
        return DIFF(val1, val2, _STDDEV);
    }
    
    /* General functions */
    function calcStatus(low, high, target, guess) {
        var range = Math.abs(high-low);
        var distance = Math.abs(target-guess);
        
        if (EQU(target, guess)) {
            return _STATUS[3];
        }
        else if (DIFF(target, guess, (range*_HOTSTAT))) {
            return _STATUS[2];
        }
        else if (DIFF(target, guess, (range*_WARMSTAT))) {
            return _STATUS[1];
        }
        else
            return _STATUS[0];
    }
    function calcDirection(target, guess) {
        if (EQU(target, guess)) {
            return _DIR[2];
        }
        else if (target < guess) {
            return _DIR[1];
        }
        else
            return _DIR[0];
    }
    function setResponseColor(status) {
        var blkcolor = "#bbbbbb";
        switch (status) {
            case _STATUS[0]: blkcolor = "#1111ee"; break;
            case _STATUS[1]: blkcolor = "#cd8825"; break;
            case _STATUS[2]: blkcolor = "#ee1111"; break;
            case _STATUS[3]: blkcolor = "#ee11ee"; break;
        }
        var txtcolor = "1px solid "+blkcolor;
        $(".out").css({'background' : blkcolor,
                       'border' : txtcolor});
        
        /*BINGO case */
        if (status === _STATUS[3]) {
            $(".out").css({'font-weight' : 'bolder',
                           'font-size' : '20px'});
            $("#txtplay").text(_RESET);
            $("#btnplay").css({'background' : '#11ee11'});
        }
    }
    function setResponse(guess, status, direction) {
        $("#entry").text(guess);
        $("#outcome").text(status);
        $("#direction").text(direction);
        setResponseColor(status);
    }
    function setRangeDisplay(low, high, setinputs) {
        if (setinputs == true) {
            $("#inlow").val(_range.low);
            $("#inhigh").val(_range.high);
        }
        $("#rnglow").text(low);
        $("#rnghigh").text(high);
        $("#inguess").val(low); /* auto set first guess to low value */
        $("#btnplay").hide(); /* let's turn off unitl guessed! */
    }
    
    function randomizeTarget(low, high) {
        return (Math.floor(Math.random()*(high-low+1)+low));
    }
    
    function togglearea(toggle) {
        if (toggle === true)
            $("#gamearea").show();
        else
            $("#gamearea").hide();
    }
    
    function toggleMessage(msgon)
    {
        if (msgon == true) {
            $("#message").show();
            $("#btnplay").show();
        }
        else {
            $("#message").hide();
        }
    }
    
    function hidePanes() {
        $("#rangepane").hide();
        $("#intropane").hide();
        $("#guesspane").hide();
        $("#responsepane").hide();
        $("#message").hide();
    }
    
    function showRange()
    {
        hidePanes();
        $("#rangepane").show();
    }
    function showGuess()
    {
        showRange();
        $("#intropane").show();
        $("#guesspane").show();
    }
    function showResponse()
    {
        showGuess();
        $("#responsepane").show();
    }
});