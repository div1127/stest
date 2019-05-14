"use strict";var argv=process.argv,path=require("path"),File=require("orion-core/lib/fs/File"),Logger=require("orion-core/lib/Logger"),ProcessUtil=require("orion-core/lib/process/ProcessUtil"),TaskManager=require("orion-core/lib/tasks/Manager"),xfs=require("orion-core/lib/xfs"),execInfo=ProcessUtil.execInfo,colors=["red","yellow","white","gray","blue","blue"],console=require("orion-core/lib/util/console-manager").console,handler=function(a,b){var c=colors[a];c&&(b=b[c]),console.log(b)},logger=require("orion-core/lib/Logger").getInstance();if(logger.addHandler(handler),xfs.setTempDir(require("os").tmpdir()),global.dirname=path.resolve(__dirname),execInfo.isProduction?execInfo.hasStudio?(xfs.setBinDir(execInfo.orionDir),xfs.setFilesDir(execInfo.orionDir)):xfs.setSeleniumDir(xfs.join(execInfo.stcDir,"selenium")):xfs.setFilesDir(new File(xfs.join(global.dirname,"..","Studio","files"))),TaskManager.on("taskCreated",function(a){var b=a.task;b.on("error",function(a){logger.error(a)}),b.on("exit",function(a){}),b.on("closed",function(a){}),b.on("logMessage",function(a){var b=a.message,c=b.level;"error"===c?logger.error(b.message||b):logger.info(b.message||b)})}),process.on("SIGINT",function(){logger.info("\nSTC interrupted by the user"),process.exit()}),argv.indexOf("--sandbox")>0)var Sandbox=require("orion-core/lib/process/ElectronSandboxProcess"),sandbox=new Sandbox;else{var cli=require("./lib/CLI");cli.bind("run","./lib/RunCommand"),cli.bind("server","./lib/ServerCommand"),cli.bind("upload","./lib/UploadCommand"),cli.bind("download","./lib/DownloadCommand"),cli.bind("merge","./lib/MergeCommand"),cli.execute()}