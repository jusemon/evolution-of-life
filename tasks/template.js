'use strict';

const handlebars  = require('handlebars');
const fs          = require('fs');

function getJS() {
  return readFile('./dist/main.min.js');
}

function getCSS() {
  return readFile('./dist/main.css');
}

function writeFile( fname, data ) {
  return new Promise(( resolve, reject ) => {
    fs.writeFile( fname, data, err => {
      if ( err ) {
        return reject( err );
      }
      resolve();
    });
  });
}

function readFile( fname ) {
  return new Promise(( resolve, reject ) => {
    fs.readFile( fname, ( err, data ) => {
      if ( err ) {
        return reject( err );
      }
      resolve( data.toString('utf8') );
    });
  });
}

function template(done) {
  let ctx = {};

  return getJS()
  .then( js => ctx.js = js )
  .then( () => getCSS() )
  .then( css => ctx.css = css )
  .then( () => readFile( './src/index.hbs') )
  .then( str => {
    let inlineResult = handlebars.compile( str )
      ({ js: ctx.js, css: ctx.css });

    writeFile( './dist/index.min.html', inlineResult )
    .then( () => {
      let result = handlebars.compile( str )();
      return writeFile( './dist/index.html', result )
    })
    .then( done );
  })
  done();
};

exports.template = template;
