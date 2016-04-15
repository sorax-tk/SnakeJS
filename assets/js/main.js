$(document).ready(function(){
  //Canvas
  var canvas = $("#canvas")[0];
  var ctx = canvas.getContext("2d");
  var w = $("#canvas").width();
  var h = $("#canvas").height();

  //Сохрание ширины ячейки для лучшего управления
  var cw = 10;
  var d;
  var food;
  var score;
  var level;
  var Speed;
  //Создание змейки
  var snake_array; // Масив ячеек

  function init()
  {
    d = "right";    //Стартовое управление
    create_snake();
    create_food();  //Создание еды
                    //Отображение Score и Level
    score = 0;
    level =1;
    speed =100;
    //Скорость змею указана через setInverval
    //через значение указаное в переменной Speed
    if(typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(paint,speed);
  }
 init();



  function create_snake()
  {
    var length = 5;    // Стартовоя длина змеи
    snake_array = [];  // Пустой масив чтобы начть
    for(var i = length-1; i>=0; i--)
    {
      // Создание горизонтальной змеи ,начиная с левого вверха
      snake_array.push({x: i, y:0});
    }
  }

  // Функция создание еды
  function create_food()
  {
    food = {
      x: Math.round(Math.random()*(w-cw)/10),
      y: Math.round(Math.random()*(h-cw)/10),
    };
    // Создание ячейки с х / у между 0-44
    // Потому что есть 45 (450/10) позиции accross строк и столбцов
  }
  // Рисование змеи
  function paint()
  {
// Чтобы избежать змеиный след нам нужно нарисовать BG на каждом кадре
// Рисование Bacground
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "black";
    ctx.strokeRect(0, 0, w, h);

// Движение змеи
    var nx = snake_array[0].x;
    var ny = snake_array[0].y;
    if(d == "right") nx++;
    else if(d == "left") nx--;
    else if(d == "up") ny--;
    else if(d == "down") ny++;
    // Рестарт игры если змея сталкиваеться с рамками
    if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
    {
      //рестарт
    init();
    alert('Game Over');
      return;
    }
    // Функция,седания змеи
    // Логика проста
    // Создание новой головы,вместо того чтобы добавлять в хвост

    if(nx == food.x && ny == food.y)
    {
      var tail = {x: nx, y: ny};
      score++;

      //Создание еды
      create_food();
      if (score%5===0) 
      {
      level++;
    clearInterval(game_loop);
    speed =speed-10;
    game_loop = setInterval(paint,speed);
     }
    }
    else
    {
      var tail = snake_array.pop();
      tail.x = nx;
      tail.y = ny;
    }


    //
    snake_array.unshift(tail); // Ложим обратно в хвост,вместо первой ячейки

    for(var i = 0; i < snake_array.length; i++)
    {
      var c = snake_array[i];
      // Клетка
      paint_cell(c.x, c.y, "#375");
    }
    // Рисование еды
    paint_cell(food.x, food.y, "black");
    // Рисование счётаи и левела
    var score_text = "Score: " + score;
    var level_text = "Level: " + level;
    ctx.fillText(score_text, 5, h-5);
    ctx.fillText(level_text, 350, h-5);
    ctx.font = "20pt VT323";
    }
// Функиция окрашивание клеток в белый цвет
  function paint_cell(x, y, color)
  {
    ctx.fillStyle = color;
    ctx.fillRect(x*cw, y*cw, cw, cw);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x*cw, y*cw, cw, cw);
  }
  function check_collision(x, y, array)
  {
     // Функция проверки предусмотренные ли х / у координаты в масиви ячеек или нет
       for(var i = 0; i < array.length; i++)
    {
      if(array[i].x == x && array[i].y == y)
       return true;
    }
    return false;
  }

  // Клавиатура
  $(document).keydown(function(e){
    var key = e.which;
    if(key == "37" && d != "right") d = "left";
    else if(key == "38" && d != "down") d = "up";
    else if(key == "39" && d != "left") d = "right";
    else if(key == "40" && d != "up") d = "down";
  })
  })
