// Used to find similarity amount between two strings via Levenshtein distance.
// https://en.wikipedia.org/wiki/Levenshtein_distance

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function similarity2(s1, s2) {
  var split1 = s1.split("");
  var split2 = s2.split("");
  var sum = 0;
  var max = 0;
  var temp = 0;
  for (var i = 0; i < split1.length; i++) {
    max = 0;
    for (var j = 0; j < split2.length; j++) {
      temp = similarity(split1[i], split2[j]);
      if (max < temp) max = temp;
    }
    console.log(temp);
    sum += max / split1.length;
  }
  return sum;
}

function editDistance(s1 = String(), s2 = String()) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function prepString(s1) {
  var arr = [];
  s1 = s1.split("/");

  s1.map((chars) => {
    if (chars.length < 1 || chars.slice(0, 2) === "ht") {
      chars = null;
    }

    if (chars) arr.push(chars);
  });

  arr = arr.join("");
  return arr;
}

// const text1 = prepString(
//   "www.quantstart.com/articles/Backtesting-a-Forecasting-Strategy-for-the-SP500-in-Python-with-pandas/"
// );
// const text2 = prepString(
//   "www.quantstart.com/articles/Research-Backtesting-Environments-in-Python-with-pandas/"
// );

const text1 =
  "www.quantstart.com/articles/Backtesting-a-Forecasting-Strategy-for-the-SP500-in-Python-with-pandas/";

const text2 =
  "www.quantstart.com/articles/Research-Backtesting-Environments-in-Python-with-pandas/";

const x = similarity(text1, text2);
console.log(x);
