$(document).ready(function () {    
            var level;
            var time_interval;
            var history;
            var animal;
            var round;
            var root = document.documentElement;
            $('#interaction').hide();
            $('#final').hide();
            $('#backstart').hide();
            function init() {
                level = 0
                history = 'O';
                $.ajax({
                    type:"POST",
                    url: 'http://34.117.178.103/get_animals',
                    dataType: 'json',
                    crossDomain: true,
                    cache: false,
                    success: function (response){
                        idx = parseInt(Math.random() * 1000) % response.animals.length ;
                        animal = response.animals[idx].genre;
                        round = response.animals[idx].round;
                        time_interval = Array(round-1).fill(5);
                        $('#animal').attr('src', response.animals[idx].picture);
                        $('#level').text(level);
                    },
                    error: function () {
                        alert("無法連線到伺服器！");
                    }
                });
            }
            init();
            function back() {
                var backstart = 3;
                var intervalstart;
                intervalstart = setInterval(function () {
                    backstart--;
                    $('#backstart').text(backstart);
                    if (backstart == 0) {
                        clearInterval(intervalstart);
                        $('#backstart').text('start').hide(1500);
                        run();
                    }
                }, 1000);
            }
            function levelup(nextmove) {
                var next = 0;
                var msg = ["Ready?", "GO!"];
                var intervalstart;
                var pic = $('#animal').attr('src');

                level++;
                history += '#' + nextmove;
                $.ajax({
                    type:"POST",
                    url: 'http://34.117.178.103/get_info',
                    data: JSON.stringify({
                        "animal": animal,
                        "history": history,
                        "isEnd": false
                    }),
                    dataType: 'json',
                    contentType: 'application/json',
                    crossDomain: true,
                    cache: false,
                    success: function (response){
                        pic = response.picture;
                    },
                    error: function () {
                        alert("無法連線到伺服器！");
                    }
                });
                
                $('#interaction').hide();
                $('#backstart').text('Level Up!').show().css("display", "inline");
                intervalstart = setInterval(function () {
                    $('#backstart').text(msg[next]);
                    next += 1
                    if (next == msg.length) {
                        $('#animal').attr('src', pic);
                        $('#level').text(level);
                        clearInterval(intervalstart);
                        $('#backstart').hide(1500);
                        run();
                    }
                }, 1000);
            }
            function endgame(nextmove) {
                var next = 0;
                var msg = ["It becomes...", "( ՞ټ՞)"];
                var intervalstart;
                var pic = $('#animal').attr('src');
                
                history += '#' + nextmove;
                $.ajax({
                    type:"POST",
                    url: 'http://34.117.178.103/get_info',
                    data: JSON.stringify({
                        "animal": animal,
                        "history": history,
                        "isEnd": true
                    }),
                    dataType: 'json',
                    contentType: 'application/json',
                    crossDomain: true,
                    cache: false,
                    success: function (response){
                        pic = response.picture;
                        $('#result-modal-title').html(response.name.split('_').join(' '));
                        $('#result-modal-body').html(response.doc.split(/\\n/gi).join('<br><br>'));
                    },
                    error: function () {
                        alert("無法連線到伺服器！");
                    }
                });

                $('#interaction').hide();
                $('#backstart').text('Finally...').show().css("display", "inline");
                intervalstart = setInterval(function () {
                    $('#backstart').text(msg[next]);
                    next += 1
                    if (next == msg.length) {
                        $('#animal').attr('src', pic);
                        $('#level').text('--');
                        $('#timer').text('--');
                        clearInterval(intervalstart);
                        $('#backstart').hide(1500);
                        $('#final').show();
                    }
                }, 1000);
                $('#btn-reset').click(function () {
                    $('#level').text(level);
                    $('#final').hide();
                    $('#btn-start').show();
                    init();
                });
                $('#btn-download').click(function () {
                    $.ajax({
                        type:"POST",
                        url: 'http://34.117.178.103/download',
                        data: JSON.stringify({
                            "animal": animal,
                            "history": history,
                        }),
                        dataType: 'json',
                        contentType: 'application/json',
                        crossDomain: true,
                        cache: false,
                        success: function (response){
                            var a = $("<a>")
                                    .attr("href", response.endpic)
                                    .attr("download", "img.png")
                                    .appendTo("body");
                            a[0].click();
                            a.remove();
                        },
                        error: function () {
                            alert("無法連線到伺服器！");
                        }
                    });
                });
            }
            function run() {
                var play_num = 0;
                var feed_num = 0;
                var bath_num = 0;
                var timecount = time_interval[level];
                var interval;
                $('#counter-play').text(0);
                $('#counter-feed').text(0);
                $('#counter-bath').text(0);
                $('#interaction').show(100);
                $("#btn-play").click(function () {
                    play_num++;
                    $("#counter-play").text(play_num);
                    play_curve();
                });
                $("#btn-feed").click(function () {
                    feed_num++;
                    $("#counter-feed").text(feed_num);
                    // addElement();
                    feed_curve();
                });
                $("#btn-bath").click(function () {
                    bath_num++;
                    $("#counter-bath").text(bath_num);
                    bath_curve();
                });

                interval = setInterval(function () {
                    timecount--;
                    $('#timer').text(timecount);

                    if (timecount == 0) {
                        clearInterval(interval);
                        if (level < time_interval.length-1){
                            levelup(get_nextmove());
                        } else {
                            endgame(get_nextmove());
                        }
                    }
                }, 1000);
            }
            function get_nextmove(){
                if ($('#counter-play').text() >= $('#counter-bath').text()){
                    if ($('#counter-play').text() >= $('#counter-feed').text()){
                        return 'P';
                    }else{
                        return 'E';
                    }
                }else{
                    if ($('#counter-bath').text() >= $('#counter-feed').text()){
                        return 'B';
                    }else{
                        return 'E';
                    }
                }
            }
            $("#btn-start").click(function () {
                $('#backstart').text('3').show().css("display", "inline");
                $('#timer').text(time_interval[level]);
                $('#btn-start').hide();
                back();
            });
            
            function play_curve(){
                //現在按鈕距離animal的距離
                var boundAnimal = $('#animal').offset();
                var boundBtn = $('#btn-play').offset();
                //中心點的水平垂直距離
                var offsetX = boundAnimal.left - (boundBtn.left + $('#btn-play').width() / 2);
                var offsetY = -(boundBtn.top - boundAnimal.top );

                root.style.setProperty('--translateX', offsetX + "px");
                root.style.setProperty('--translateY', offsetY + "px"); 
                root.style.setProperty('--animation-Name', "bounce");
                root.style.setProperty('--animation-duration', "0.5s");
                $('#play').css("display", "block");
                $("#animal").addClass("animated");
                setTimeout(() => {
                    $('#play').css("display", "none");
                    $("#animal").removeClass("animated");
                },  500 ) ;
            }

            function bath_curve(){
                //現在按鈕距離animal的距離
                var boundAnimal = $('#animal').offset();
                var boundBtn = $('#btn-bath').offset();
                //中心點的水平垂直距離
                var offsetY = (boundAnimal.top ) - (boundBtn.top + $('#btn-bath').height() / 2);
                // root.style.setProperty('--change_left_bath', $('#btn-bath').position().left + "px");
                root.style.setProperty('--translateX', "0px");
                root.style.setProperty('--translateY', offsetY + "px");
                root.style.setProperty('--animation-Name', "bounce");
                root.style.setProperty('--animation-duration', "0.5s");
                $('#bath').css("display", "block");
                $("#animal").addClass("animated");
                setTimeout(() => {
                    $('#bath').css("display", "none");
                    $("#animal").removeClass("animated");

                },  500 ) ;
            }

            function feed_curve(){
                //現在按鈕距離animal的距離
                var  boundAnimal = $('#animal').offset();
                var boundBtn = $('#btn-feed').offset();
                //中心點的水平垂直距離
                var offsetX = -(boundBtn.left  - (boundAnimal.left + $('#animal').width()/2));
                var offsetY = -(boundBtn.top - boundAnimal.top);
                root.style.setProperty('--translateX', offsetX + "px");
                root.style.setProperty('--translateY', offsetY + "px");
                root.style.setProperty('--animation-Name', "scale_rotate");
                root.style.setProperty('--animation-duration', "1s");        
                $('#feed').css("display", "block");
                $("#animal").addClass("animated");
                setTimeout(() => {
                    $('#feed').css("display", "none");
                    $("#animal").removeClass("animated");
                },  500 ) ;
            }            
        });