"use strict";function _interopRequireDefault(a){return a&&a.__esModule?a:{"default":a}}function escape(a){return"undefined"==typeof a&&(a=""),String(a).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\r?\n|\r/g,"")}var _stringify=require("babel-runtime/core-js/json/stringify"),_stringify2=_interopRequireDefault(_stringify),_typeof2=require("babel-runtime/helpers/typeof"),_typeof3=_interopRequireDefault(_typeof2),_getPrototypeOf=require("babel-runtime/core-js/object/get-prototype-of"),_getPrototypeOf2=_interopRequireDefault(_getPrototypeOf),_classCallCheck2=require("babel-runtime/helpers/classCallCheck"),_classCallCheck3=_interopRequireDefault(_classCallCheck2),_createClass2=require("babel-runtime/helpers/createClass"),_createClass3=_interopRequireDefault(_createClass2),_possibleConstructorReturn2=require("babel-runtime/helpers/possibleConstructorReturn"),_possibleConstructorReturn3=_interopRequireDefault(_possibleConstructorReturn2),_inherits2=require("babel-runtime/helpers/inherits"),_inherits3=_interopRequireDefault(_inherits2),builder=require("xmlbuilder"),Base=require("orion-core/lib/Base"),File=require("orion-core/lib/fs/File"),ReporterBase=require("orion-core/lib/reporter/ReporterBase"),JUnitReporter=function(a){function b(){return(0,_classCallCheck3["default"])(this,b),(0,_possibleConstructorReturn3["default"])(this,(b.__proto__||(0,_getPrototypeOf2["default"])(b)).apply(this,arguments))}return(0,_inherits3["default"])(b,a),(0,_createClass3["default"])(b,[{key:"ctor",value:function(a){var b=this,c=b.archivePath.replace(/\./g," ").replace(/^\//,"").replace(/\//g,"."),d=b.scenario.name.replace(/\./g," ");b._suites={},b._currentSuite={},b._currentTest={},b._breadcrumb={},b._xml={},b._browserId={},b._prefix=c+(c&&d?".":"")+d}},{key:"testRunStarted",value:function(a){var b=this,c=a.agent,d=c.id,e=c.agentGroup,f=e.id;if(b._getXmlRoot(c),b._breadcrumb[d]=[],!b._browserId[f]){var g=c.agentGroup.browser;b._browserId[f]=g.canonicalName+(g.parsedVersion?g.parsedVersion.major:"")+(g.canonicalPlatform?g.canonicalPlatform:"")}}},{key:"testRunFinished",value:function(a){var b,c,d=this,e=a.agent,f=e.agentGroup,g=f.browser,h=d._getXmlRoot(e),i=g.parsedVersion?g.parsedVersion.major:"",j=g.canonicalPlatform,k=g.canonicalName;return i&&(k+="-"+i),j&&(k+="-"+j),b=new File(d.workdir||process.cwd()),c=new File(b,k+".xml"),c.write(h.end({pretty:!0}))}},{key:"testSuiteEnter",value:function(a){var b=this,c=a.agent,d=c.id,e=(c.agentGroup,a.fileName),f=b._suites[d]||(b._suites[d]={});if(e){e=e.replace(".js"," js").replace(/\//g,".");var g=b._getXmlRoot(c),h=g.ele("testsuite",{name:escape(e),tests:0,errors:0,failed:0});f[a.id]=h}}},{key:"testSuiteStarted",value:function(a){var b=this,c=a.agent,d=b._suites[c.id][a.id];d&&(b._currentSuite[c.id]=d),b._breadcrumb[c.id].push(a.name)}},{key:"testSuiteFinished",value:function(a){var b=this,c=a.agent,d=b._breadcrumb[c.id];d.pop()}},{key:"testStarted",value:function(a){var b,c=this,d=a.agent,e=c._breadcrumb[d.id],f=c._currentSuite[d.id],g=c._browserId[d.agentGroup.id];e.push(a.name),b=escape(e.join(".")),c._currentTest[d.id]=f.ele("testcase",{name:b,classname:g+"."+c._prefix+"."+f.attributes.name.value})}},{key:"testFinished",value:function(a){var b=this,c=a.agent,d=b._breadcrumb[c.id],e=b._currentSuite[c.id],f=b._currentTest[c.id],g=0;a.passed||(g=1,a.expectations.forEach(function(a){a.passed||f.ele("failure",{message:escape(a.message)},escape(a.details))}));var h=e.attributes.tests,i=e.attributes.failed;e.att("tests",parseInt(h.value||0)+1),e.att("failed",parseInt(i.value||0)+g),d.pop()}},{key:"systemError",value:function(a){var b,c=this,d=a.agent,e=d.id,f=(d.agentGroup.id,a.error||a.message);"object"===("undefined"==typeof f?"undefined":(0,_typeof3["default"])(f))&&(f=(0,_stringify2["default"])(f,null,4)),b=c._currentTest[e]||c._currentSuite[e]||c._getXmlRoot(d),b.ele("error",{message:escape("System error")},escape(f))}},{key:"_getXmlRoot",value:function(a){var b=this,c=a.agentGroup,d=c.id,e=(c.browser,a.browserFullName),f=a.userAgentString,g=b._xml[d];if(!g){var h=builder.create("testsuites"),i=h.ele("properties");i.ele("property",{name:"browser.name",value:e}),f&&i.ele("property",{name:"browser.userAgent",value:f}),g=b._xml[d]=h}return g}}]),b}(ReporterBase);module.exports=JUnitReporter;