require('colors');
const Jasmine = require('jasmine');
const jasmine = new Jasmine();


jasmine.loadConfig({
  spec_dir: "spec",
  spec_files: [
    "**/*[sS]pec.js"
  ],
  helpers: [
    "helpers/**/*.js"
  ],
  stopSpecOnExpectationFailure: false,
  random: true
});


const customReporter = {
  jasmineStarted(suiteInfo) {
    console.log('hi');
    console.log('==>'.magenta);
    console.log(`*** Running suite with ' ${suiteInfo.totalSpecsDefined} ***`.magenta);
    console.log('==>'.magenta);
  },

  suiteStarted(result) {
    // console.log('Suite started: '
    //   + result.description
    //   + ' whose full description is: '
    //   + result.fullName);
  },

  specStarted(result) {
    // console.log('Spec started: '
    //   + result.description
    //   + ' whose full description is: '
    //   + result.fullName);
  },

  specDone(result) {
    if (result.status !== 'failed') {
      console.log(` => ${result.fullName}`.green);
    } else {
      console.log(` => ${result.fullName}`.red);
    }
  },

  suiteDone(result) {
    // console.log('Suite: '
    //   + result.description
    //   + ' was '
    //   + result.status);
    //
    // result.failedExpectations.forEach(failure => {
    //   console.log(failure.message);
    //   console.log(failure.stack);
    // });
  },

  jasmineDone(result) {
    // console.log('Finished suite: ' + result.overallStatus);
    //
    // result.failedExpections.forEach(failure => {
    //   console.log(failure.message);
    //   console.log(failure.stack);
    // });
  }
};

jasmine.addReporter(customReporter);

jasmine.onComplete(function (passed) {
  if (passed) {
    console.log('All specs have passed!!');
  }
  else {
    console.log('At least one spec has failed!!');
  }
  jasmine.exitCodeCompletion(passed);
});

jasmine.execute();
