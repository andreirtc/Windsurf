// If this file is updated and its version number changed, also update its reference at:
// /resources/views/common/visualpage.blade.php

var mode = "exploration";
var codetraceColor = 'white';

actionsWidth = 0;

// codetrace highlight
function highlightLine(lineNumbers) { /* lineNumbers can be an array or a single number. Yay overloading! */
    $('#codetrace p').css('background-color', colourTheThird).css('color', codetraceColor);
    if (lineNumbers instanceof Array) {
        for (var i = 0; i < lineNumbers.length; i++)
            if (lineNumbers[i] != 0)
                $('#code' + lineNumbers[i]).css('background-color', 'black').css('color', 'white');
    } else
        $('#code' + lineNumbers).css('background-color', 'black').css('color', 'white');
}

var isPlaying = false;

// Opening and closing panels
var cur_slide = null;
var last_click = 0;

function isActionsOpen() {
    return ($('#actions-hide span').length && $('#actions-hide span').hasClass('rotateRight')) || ($('#actions-hide img').length && $('#actions-hide img').hasClass('rotateRight'));
}

function isStatusOpen() {
    return $('#status').hasClass('statusOpen');
}

function isCodetraceOpen() {
    return $('#codetrace-hide img').hasClass('rotateRight');
}

// vars actionsWidth and statusCodetraceWidth must be defined in the specific visualization module
function showActionsPanel() {
    if (!isActionsOpen()) {
        //$('#actions-hide span').css({'transform': 'rotate(180deg)'})
        //$('#actions-hide span').text('>');
        if ($('#actions-hide span').length) {
            $('#actions-hide span').removeClass('rotateLeft').addClass('rotateRight');
        } else {
            $('#actions-hide img').removeClass('rotateLeft').addClass('rotateRight');
        }
        $('#actions').animate({
            width: "+=" + actionsWidth,
        });
        //assuming that if student wants to try another action, student is done with current action
        if (isMobile()) {
            hideStatusPanel();
            hideCodetracePanel();
        }
    }
}

function hideActionsPanel() {
    if (isActionsOpen()) {
        //$('#actions-hide span').text('<');
        if ($('#actions-hide span').length) {
            $('#actions-hide span').removeClass('rotateRight').addClass('rotateLeft');
        } else {
            $('#actions-hide img').removeClass('rotateRight').addClass('rotateLeft');
        }
        $('#actions').animate({
            width: "-=" + actionsWidth,
        });
    }
}

function showStatusPanel() {
    if (!isStatusOpen()) {
        //$('#status-hide img').removeClass('rotateLeft').addClass('rotateRight');
        $('#status').removeClass('statusClosed').addClass('statusOpen');
        $('#current-action').show();
        $('#status').animate({
            width: "+=" + statusCodetraceWidth,
        });
    }
}

function hideStatusPanel() {
    if (isStatusOpen()) {
        //$('#status-hide img').removeClass('rotateRight').addClass('rotateLeft');
        $('#status').removeClass('statusOpen').addClass('statusClosed');
        $('#current-action').hide();
        $('#status').animate({
            width: "-=" + statusCodetraceWidth,
        });
    }
}

function showCodetracePanel() {
    if (!isCodetraceOpen()) {
        $('#codetrace-hide img').removeClass('rotateLeft').addClass('rotateRight');
        $('#codetrace').animate({
            width: "+=" + statusCodetraceWidth,
        });
    }
}

function hideCodetracePanel() {
    if (isCodetraceOpen()) {
        $('#codetrace-hide img').removeClass('rotateRight').addClass('rotateLeft');
        $('#codetrace').animate({
            width: "-=" + statusCodetraceWidth,
        });
    }
}

function triggerRightPanels() {
    hideEntireActionsPanel();
    if (!isMobile()) {
        showCodetracePanel();
    }
    showStatusPanel();
}

function extractQnGraph(graph) {
    var vList = graph.internalAdjList;
    var eList = graph.internalEdgeList;
    for (var key in vList) {
        var temp;
        var v = vList[key];
        temp = v.cxPercentage;
        v.cxPercentage = v.cx;
        v.cx = (temp / 100) * MAIN_SVG_WIDTH;
        temp = v.cyPercentage;
        v.cyPercentage = v.cy;
        v.cy = (temp / 100) * MAIN_SVG_HEIGHT;
    }
    return graph;
}

// function rateGraph() {
//   var rating = $(this).attr('id').substring(18);
//   $.ajax({
//     url: PHP_DOMAIN + '/php/Graph.php?mode=' + MODE_ADD_SUBMITTED_GRAPH_RATING,
//     type: "POST",
//     data: {graphID: randomGraphID, rating: rating}
//   }).done(function(data) {
//     $('#rate-sample-graph').hide();
//   });
// }

// function hoverRating() {
//   var rating = $(this).attr('id').substring(18);
//   for (var i = 1; i <= 5; i++)
//     $('#rate-sample-graph-'+i).html('&#9734;');
//   for (var i = 1; i <= rating; i++)
//     $('#rate-sample-graph-'+i).html('&#9733;');
// }

function closeSlide(slide, callback) {
    if (typeof slide == 'undefined' || slide == null) {
        if (typeof callback == "function") callback();
        return
    }
    lectureDropdownSelect = $('#electure-dropdown');
    $(".menu-highlighted").removeClass("menu-highlighted");
    $('.electure-dialog#electure-' + slide).fadeOut(100, function() {
        var lectureDropdownSelect = $('#electure-dropdown');
        lectureDropdownSelect.detach();
        lectureDropdownSelect.appendTo('#dropdown-temp-holder');
        if (typeof callback == "function") callback();
    })
}

function canContinue() {
    var this_click = (new Date()).getTime();
    if ((this_click - last_click) < 200) return false; // less than 0.2s delay
    last_click = this_click;
    return true;
}

function openSlide(slide, callback) {
    mode = 'e-Lecture';
    isPlaying = false;
    if (typeof gw != 'undefined' && gw != null && typeof gw.stop == 'function' && isPlaying) {
        try { // Steven's remarks, something is incorrect when dealing with graph widget
            gw.stop();
        } catch (err) {

        }
    }
    if (!canContinue()) return;

    closeSlide(cur_slide, function() {
        cur_slide = slide;
        var lectureDropdownSelect = $('#electure-dropdown');
        lectureDropdownSelect.detach();
        lectureDropdownSelect.appendTo('.electure-dialog#electure-' + cur_slide);

        $('select.lecture-dropdown').val(cur_slide);
        $('.electure-dialog#electure-' + cur_slide).fadeIn(100, function() {
            if (typeof callback == "function") callback();
        });
    });
    setTimeout(function() {
        $('select.lecture-dropdown').focus();
    }, 150); // after 100ms fadeIn
}

function initUI() {
    var actionsHeight = ($('#actions p').length) * 27 + 10;
    $('#actions').css('height', actionsHeight);
    $('#actions').css('width', actionsWidth);
    var actionsIconHeight = 0;
    if ($('#actions-hide span').length) {
        actionsIconHeight = $('#actions-hide span').height();
    } else {
        actionsIconHeight = $('#actions-hide img').height();
    }
    var actionsHideTop = Math.floor((actionsHeight - actionsIconHeight) / 2);
    var actionsHideBottom = (actionsHeight - actionsIconHeight) - actionsHideTop;
    //$('#actions-hide').css('height', actionsHeight);
    $('#actions-hide').css('padding-top', actionsHideTop);
    $('#actions-hide').css('padding-bottom', actionsHideBottom);

    $('#current-action').hide();
    if ($('#actions-hide span').length) {
        $('#actions-hide span').addClass('rotateRight');
    } else {
        $('#actions-hide img').addClass('rotateRight');
    }

    // surpriseColour stuff
    $('.electure-print').css("background-color", surpriseColour);
    $('.electure-end').css("background-color", surpriseColour);
    $('.electure-prev').css("background-color", surpriseColour);
    $('.electure-next').css("background-color", surpriseColour);
    // $('.electure-section-prev').css("background-color", colourTheFourth);
    // $('.electure-section-next').css("background-color", colourTheFourth);

    $('#hide-popup').css('background-color', surpriseColour);

    // if (surpriseColour == "#fec515" || surpriseColour == '#a7d41e') {
    //$('.electure-next').css("color", "black"); // this is the source of bug (sometimes next button is black?)
    // var imgUrl = $('.electure-next img').attr("src");
    // if (imgUrl) {
    //   $('.electure-next img').attr("src", imgUrl.replace('white', 'black'));
    // }
    //}
    $('#progress-bar .ui-slider-range').css("background-color", surpriseColour);

    $('#actions').css("background-color", colourTheSecond);
    $('#actions-hide').css("background-color", colourTheSecond);
    $('.action-menu-pullout').css('left', actionsWidth + 43 + 'px');
    $('.action-menu-pullout').children().css('float', 'left');
    $('.coloured-menu-option').css("background-color", colourTheSecond).css('color', 'white');

    // this part causes color bug :(..., I turn it off
    // if (colourTheSecond == '#fec515' || colourTheSecond == '#a7d41e') {
    // //$('#actions p').css('color', 'black');
    // $('#actions p').hover(function() {
    //   $(this).css('color', 'white');
    // }, function() {
    //   $(this).css('color', 'black');
    // });
    // $('.coloured-menu-option').css('color', 'black');
    // $('.coloured-menu-option').hover(function() {
    //   $(this).css('color', 'white');
    // }, function() {
    //   $(this).css('color', 'black');
    // });
    // $('#actions-hide img').attr('src', 'img/arrow_black_right.png');
    // }

    $('#codetrace').css("background-color", colourTheThird);
    $('#codetrace-hide').css("background-color", colourTheThird);
    if (colourTheThird == '#fec515' || colourTheThird == '#a7d41e') {
        $('#codetrace').css('color', 'black');
        var imgUrl = $('#codetrace-hide img').attr('src');
        if (imgUrl) {
            $('#codetrace-hide img').attr('src', imgUrl.replace('white', 'black'));
        }
        codetraceColor = 'black';
    }

    $('#status, #status-for-embed').css("background-color", colourTheFourth);
    $('#status-hide').css("background-color", colourTheFourth);
    if (colourTheFourth == '#fec515' || colourTheFourth == '#a7d41e') {
        $('#status, #status-for-embed').css('color', 'black');
        var imgUrl = $('#status-hide img').attr('src');
        if (imgUrl) {
            $('#status-hide img').attr('src', imgUrl.replace('white', 'black'));
        }
    }
}

function end_eLecture() {
    $("#mode-menu a").trigger("click");
    hideOverlay();
    closeSlide(cur_slide);
    mode = 'exploration';
}

let speedVal = 1;
// playback control
function createPlaybackSpeedSlider(defaultPlaybackSpeed) {
    // Update on 20 Mar 2023 to make the multiplier value accurately reflect the speedup over default speed
    $("#speed-input").slider({
        range: false,
        min: 1.0,
        max: 7.0, // changed to 7 at Steven's request - Ting Xiao 2023
        value: defaultPlaybackSpeed,
        step: 1.0,
        change: function(event, ui) {
            gw.setAnimationDuration(700 / ui.value);
            $('#viz-speed-value').html(Math.round((speedVal + Number.EPSILON) * 100) / 100 + "x");
        },
        slide: function(event, ui) {
            speedVal = ui.value;
            $('#viz-speed-value').html(Math.round((speedVal + Number.EPSILON) * 100) / 100 + "x");
        }
    });

    speedVal = defaultPlaybackSpeed;
}

$(function() {
    $("#progress-bar").slider({
        range: "min",
        min: 0,
        value: 0,
        slide: function(event, ui) {
            gw.pause(); //might seem counter-intuitive but need this line to prevent animation speedups when progress-bar slides
            gw.jumpToIteration(ui.value, 0);
        },
        stop: function(event, ui) {
            if (!isPaused) {
                setTimeout(function() {
                    gw.play();
                }, 500);
            }
        }
    });

    initUI();

    // gw.setAnimationDuration(700 / speedVal); // also do this (patch on 17 Apr 23 by Steven to make playback speed works as intended upon page load)

    // $('.rating-star').hover(hoverRating, function() {
    //   for (var i = 1; i <= 5; i++) {
    //     $('#rate-sample-graph-' + i).html('&#9734;');
    //   }
    // });
    // $('.rating-star').click(rateGraph);

    // mode menu
    $('#mode-button').click(function() {
        $('#other-modes').toggle();
    });
    $('#mode-menu').hover(function() {
        $('#other-modes').show();
    }, function() {
        $('#other-modes').hide();
    });

    $('#mode-menu a').hover(function() {
        $(this).css("background", surpriseColour);
    }, function() {
        $(this).css("background", "rgb(0,0,0)");
    });

    $('#other-modes a').click(function() {
        var currentMode = $('#mode-button').attr('title');
        var newMode = $(this).attr('title');
        var tmp = $('#mode-button').html().substring(0, $('#mode-button').html().length - 2);
        $('#mode-button').html($(this).html() + ' &#9663;');
        $(this).html(tmp);

        $('#mode-button').attr('title', newMode);
        $(this).attr('title', currentMode);

        if (newMode == "e-Lecture") { // e-Lecture Mode
            showOverlay();
            mode = "e-Lecture";
            if (isPlaying) stop();
            ENTER_LECTURE_MODE();

            if (cur_slide == null) cur_slide = ($('#electure-1').length ? '1' : '99');
            openSlide(cur_slide, function() {
                runSlide(cur_slide);
                pushState(cur_slide);
            });
        } else if (newMode == "exploration") { // Exploration Mode
            makeOverlayTransparent();
            mode = "exploration";

            $('.electure-dialog').hide();
            hideStatusPanel();
            hideCodetracePanel();
            showActionsPanel();
            pushState();
            ENTER_EXPLORE_MODE();
        }
        $('#other-modes').hide();
    });

    // arrow buttons to show/hide panels
    $('#status-hide').click(function() {
        if (isStatusOpen())
            hideStatusPanel();
        else
            showStatusPanel();
    });

    $('#codetrace-hide').click(function() {
        if (isCodetraceOpen())
            hideCodetracePanel();
        else
            showCodetracePanel();
    });

    $('#actions-hide').click(function() {
        if (isActionsOpen()) {
            hideEntireActionsPanel(); // as each visualization is different, we must define a custom hideEntireActionsPanel() function in visualization module
        } else {
            showActionsPanel();
        }
    });

    $('.electure-end').click(
        (event) => {
            end_eLecture();
            event.stopPropagation();
        }
    );

    $('.electure-prev').click(function() {
        openSlide($(this).attr('data-nextid'));
    });

    $('.electure-next').click(function() {
        openSlide($(this).attr('data-nextid'));
    });

    $(document).keydown(function(event) {
        if (event.which == 32) { // spacebar
            if (mode != "e-Lecture" && event.target.nodeName != "TEXTAREA" && event.target.nodeName != "INPUT") {
                if (isPaused)
                    play();
                else
                    pause();
            }
        } else if (event.which == 33) { // page up, don't use left arrow event.which == 37 ||
            if (mode == "e-Lecture" && !isPlaying)
                $('#electure-' + cur_slide + ' .electure-prev').click();
            event.preventDefault(); // don't change the cursor position
        } else if (event.which == 34) { // page down, don't use right arrow event.which == 39 ||
            if (mode == "e-Lecture" && !isPlaying)
                $('#electure-' + cur_slide + ' .electure-next').click();
            event.preventDefault(); // don't change the cursor position
        } else if (event.which == 37) {
            // Detects that the cursor is not in an input text area so that the animation does not jump while user is editing input, 
            // such as the code box in the recursion page visualgo.net/en/recursion.
            if (mode != "e-Lecture" && event.target.nodeName != "TEXTAREA" && event.target.nodeName != "INPUT")
                stepBackward();
        } else if (event.which == 39) {
            if (mode != "e-Lecture" && event.target.nodeName != "TEXTAREA" && event.target.nodeName != "INPUT")
                stepForward();
        } else if (event.which == 27) { // escape (turn off e-Lecture mode)
            if ($("#dark-overlay").css('display') == 'none') { // cannot turn on e-Lecture mode when another overlay (graph drawing/terms/about/team) appears
                stop(); // must stop whatever playing
                if (mode == "e-Lecture") {
                    $(".menu-highlighted").removeClass("menu-highlighted");
                    end_eLecture();
                } else {
                    $('#other-modes a').click(); // trigger the e-Lecture mode
                }
            }
        } else if (event.which == 35) { // end
            if (mode != "e-Lecture")
                stop();
        } else if (event.which == 189) { // minus
            //var d = (2200-gw.getAnimationDuration()) - 100;
            if (mode != "e-Lecture" && event.target.nodeName != "TEXTAREA" && event.target.nodeName != "INPUT") {
                speedVal = Math.max(1, speedVal - 1);
                $("#speed-input").slider("value", speedVal); // d > 0 ? d : 0);
            }
        } else if (event.which == 187) { // plus
            //var d = (2200-gw.getAnimationDuration()) + 100;
            if (mode != "e-Lecture" && event.target.nodeName != "TEXTAREA" && event.target.nodeName != "INPUT") {
                speedVal = Math.min(7, speedVal + 1);
                $("#speed-input").slider("value", speedVal); // d <= 2000 ? d : 2000);
            }
        }
    });
});

var isPaused = false;

function isAtEnd() {
    return (gw.getCurrentIteration() == (gw.getTotalIteration() - 1));
}

function pause() {
    if (isPlaying) {
        isPaused = true;
        gw.pause();
        $('#play').show();
        $('#pause').hide();
        $('#mobile-playback-overlay').removeClass('playing');
        $('#mobile-playback-overlay').addClass('paused');
        $('#mobile-playback-play').show();
        $('#mobile-playback-pause').hide();
    }
}

function play() {
    if (isPlaying) {
        isPaused = false;
        $('#pause').show();
        $('#play').hide();

        $('#mobile-playback-overlay').removeClass('paused');
        $('#mobile-playback-overlay').addClass('playing');
        $('#mobile-playback-pause').show();
        $('#mobile-playback-play').hide();
        if (isAtEnd())
            gw.replay();
        else
            gw.play();
    }
}

function stepForward(numFrames) {
    if (isPlaying) {
        //pause();
        if (numFrames && Number.isInteger(numFrames)) {
            gw.jumpToIteration(gw.getCurrentIteration() + 7, 250);
        } else
            gw.forceNext(250);
    }
}

function stepBackward(numFrames) {
    if (isPlaying) {
        //pause();
        if (numFrames && Number.isInteger(numFrames)) {
            gw.jumpToIteration(gw.getCurrentIteration() - 7, 250);
        } else
            gw.forcePrevious(500);
    }
}

function goToBeginning() {
    if (isPlaying) {
        gw.jumpToIteration(0, 0);
        pause();
    }
}

function goToEnd() {
    if (isPlaying) {
        gw.jumpToIteration(gw.getTotalIteration() - 1, 0);
        pause();
    }
}

function stop() {
    try { // Steven's remarks, something is incorrect when dealing with graph widget
        gw.stop();
    } catch (err) {

    }
    isPaused = false;
    isPlaying = false;
    $('#pause').show();
    $('#play').hide();
    $('#mobile-playback-pause').show();
    $('#mobile-playback-play').hide();
}

// move Ting Xiao's scaling from individual pages to common viz...js
function toggleScale() {
    if (isPlaying) stop();
    isPlaying = false;
    if (scale)
        setDefaultScale();
    else
        setMediumScale();
}

function setDefaultScale(vertex_only) {
    if (isPlaying) stop();
    isPlaying = false;
    if (scale) {
        scale = !scale;
        gw.redrawAllForMediumScale(vertex_only); // true);
        gw.setMediumScale(false);
        // gw.toggleVertexNumber();
        $('#scale').html('1.0x');
        redraw();
    }
}

function setMediumScale(vertex_only) {
    if (isPlaying) stop();
    isPlaying = false;
    if (!scale) {
        scale = !scale;
        gw.redrawAllForMediumScale(vertex_only); // true);
        gw.setMediumScale(true);
        // gw.toggleVertexNumber();
        $('#scale').html('0.5x');
        redraw();
    }
}