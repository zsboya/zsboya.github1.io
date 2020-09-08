// Az aktuális időpont (h:m:s) bekérése és beírása a timeUnitsArr tömbbe [h,m,s].

let timeUnitsArr = [];  // timeUnitsArr = new Array();

function getTime() {

    let date = new Date();
    
    timeUnitsArr = [ date.getHours(), date.getMinutes(), date.getSeconds() ];
}


// Az aktuális időegységek, mint végpontok kiinduló ponthoz (0) viszonyított szögének kiszámítása.

      // De nem 12 órás AM/PM-módban, hanem 24h-s (hEnd) mmódban jelenítjük meg az órákat! 
const timeUnitsEndArr = [ 24, 60, 60 ];  // Időegységek maximumának tömbje [hEnd, mEnd, sEnd]. 

const nullAngle  = 1.5 * Math.PI;  // Ez az óralapon a kinduló pont (0 = 12): 0h 0m 0s!
const fullCircle = 2.0 * Math.PI;  // Ez a teljes körív hossza radian-ban.

let endAnglesArr  = [];  // Az eltelt időegységekhez (végpontok) tartozó szög (radiánban).
let endTimesPcArr = [];  // Az eltelt időegységek százalékban (Pc: PerCent).

function endTimesDatasCompute() {
    
    for ( let j=0; j<3; j++ ) {
        endAnglesArr[j] = fullCircle / timeUnitsEndArr[j] * timeUnitsArr[j] + nullAngle;
        endTimesPcArr[j] = (timeUnitsArr[j] / timeUnitsEndArr[j] *100).toFixed(1);
    }
}  // 0.:hours, 1.:mins, 2.:secs endAngle.


// A rajzoláshoz szükséges canvas (a használandó terület) és context változók deklarálása.

let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

function previousStateClear() {

    ctx.clearRect( 0, 0, canvas.width, canvas.height );  
    // Törli a myCanvas téglalap helyét, vagyis az előző állapotot (az óraállásokat).
}


// Az időegység kerekek eltelt és hátralévő idejének kirajzoltatása.

colorArr = new Array(2);  // A colorArr[2,3] 2x3 elemű 2-dimenziós tömb deklarálása.
for (let i=0; i < colorArr.length; ++i) {  colorArr[i] = new Array(3); 

    let a = 1-i/2;  // alpha: a0 = 1, a1 = 0.5 
    colorArr[i][0] = `rgba( 255, 0, 0, ${a} )`;
    colorArr[i][1] = `rgba( 0, 255, 0, ${a} )`;
    colorArr[i][2] = `rgba( 0, 0, 255, ${a} )`;  
}
// Az eltelt (0.:color1) és a hátralévő (1.:color2) időegység (0:h, 1:m, 2:s) színe.

function drawArc( j, ox, oy, radius, startAngle, endAngle ) {
             
    ctx.lineWidth = 50;  // Vonalvastagság, vagyis az időkerék karimájának a szélessége.

    if (startAngle == endAngle) { startAngle -= 0.000001; }
    // Kis trükk, hogy 0-s startszög esetén a teljes körív kirajzolódjon hátralévőként (color2)!
    
    for ( let i=0; i<2; i++ ) {

        ctx.beginPath();
        ctx.arc( ox, oy, radius, startAngle, endAngle, i%2 );
             
        ctx.strokeStyle = colorArr[i][j];  // false (0): colorArr[0][] , true (1): colorArr[1][]
        ctx.stroke();
    }
}


// A 3 időkeréken lévő körívek paramétereinek beállítása és a megfelelő színekkel való kirajzoltatása.

const circleUnit = 200;
const circleRadius = 68;

const origoX  = 100;

const origoY = 100;
const origoYArr = [ origoY, origoY + 1*circleUnit, origoY + 2*circleUnit ];

function threeArcsDraw() {
    
    for ( let j=0; j<3; j++ ) {
        drawArc ( j, origoX, origoYArr[j], circleRadius, nullAngle, endAnglesArr[j] );
    }
}


// A kiirandó szövegek paramétereinek beállítása (t: text) majd kiiratása.

const tShiftX = 10;  
const tShiftY = 25;

const textX = circleUnit + tShiftX;

textYArr = new Array(2);  // A textYArr[2,3] 2x3 elemű 2-dimenziós tömb deklarálása.
for (i=0; i < textYArr.length; ++i) { textYArr[i] = new Array(3); }

for ( let j=0; j<3; j++ ) {
    textYArr[0][j] = origoYArr[j] - tShiftY;
    textYArr[1][j] = origoYArr[j] + tShiftY;
}

const tBgWidth  = 2*207;  // 2-vel osztható legyen!
const tBgHeight = 2* 22;  // 2*(20px betűmagasság + 2)

ctx.font = "20px Arial";

function textColorPrint() {  // Az eltelt és a hátralévő időegységek kiiratása színesben.
  
    const textColorArr = [ 
        ["napból","órából","percből" , " órák (h) száma: "," percek (m) száma: "," másodpercek (s) száma: "] ,
        ["E napból","Az órából","A percből" , " órák (h) száma: "," percek (m) száma: "," másodpercek (s) száma: "] ];
    
    for ( let i=0; i<2; i++ ) {
        for ( let j=0; j<3; j++ ) {
    
            switch(i) { 
                case 0:
                    fillRectColor = "#aaaaaa";  // A textColor1 hátterének beállítása erre a színre.
                    textColorArr[i][j] = " Az aktuális " + textColorArr[i][j] + " eddig eltelt egész";
                    textColorArr[i][3+j] = textColorArr[i][3+j] + `${timeUnitsArr[j]} db = ${endTimesPcArr[j]} %. `;
                break;
                case 1:
                    fillRectColor = "#292929";  // A textColor2 hátterének beállítása erre a színre.
                    textColorArr[i][j] = "(" + textColorArr[i][j] + " még hátralévő, teljesen le nem telt";
                    textColorArr[i][3+j] = textColorArr[i][3+j] +
                    `${timeUnitsEndArr[j] - timeUnitsArr[j]} db = ${(100 - endTimesPcArr[j]).toFixed(1)} %.)`;
                break;
            }

            ctx.fillStyle = fillRectColor;
            ctx.fillRect(textX - tShiftX/2, textYArr[i][j] - tBgHeight/2, tBgWidth, tBgHeight);
                    
            ctx.fillStyle = colorArr[i][j];
            ctx.textBaseline = "bottom";
            ctx.fillText( textColorArr[i][0+j], textX, textYArr[i][j] );
            ctx.textBaseline = "top";
            ctx.fillText( textColorArr[i][3+j], textX, textYArr[i][j] );
        }
    }
}


// A fő-függvény!

function drawAll() {

    getTime();               // Az aktuális idő (h:m:s) bekérése.
    endTimesDatasCompute();  // A 3 időegység maximumaihoz tartozó értékek kiszámítása.

    previousStateClear();    // Törli az előzőleg kirajzolt állapotot (óraállásokat és kiírt időegységeket).
    threeArcsDraw();         // Az aktuális 3 időegység (h,m,s) kerekeinek kirajzolása a megfelelő színekkel.
    
    textColorPrint();        // Az eltelt és a hátralévő időegységek (h,m,s) kiiratása a megfelelő színekkel.

}


/* drawAll();  // A fó-függvény azonnali (1.) meghívása. */
setInterval(drawAll, 1000);  // A fó-fv. másodpercenkénti (1000 msec) meghívása.
