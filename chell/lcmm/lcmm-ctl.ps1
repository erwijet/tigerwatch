#Requires -RunAsAdministrator
#Requires -Version 5.1

$cur_proc = get-process | where-object Name -match "lcmm"

try {
    if (-not @("start", "stop", "proc").Contains($args[0])) {
        throw "invalid args"
    }
}
catch { 
    write-host "Usage: .\lcmm-ctl.ps1 start|stop|proc"
    exit -1
}

if ($null -ne $cur_proc) {
    if ($args[0] -eq "stop") {
        stop-process $cur_proc
        write-host "[ok]`tterminated"
    }
    elseif ($args[0] -eq "start") {
        write-host "[err]`tlcmm is already running. Run '.\lcmm-ctl.ps1 stop' to stop the server"
        exit -1
    }
    else {
        write-output $cur_proc
    }
    
    exit 0
}

# if there was a process and the command was "stop", it would have been handled in the block above
if ($args[0] -eq "stop") {
    write-host "[err]`tlcmm does not appear to be running. Check with '.\lcmm-ctl.ps1 proc'?"
    exit -1
}

if ($args[0] -eq "start") {
    if (-not $(test-path -Path .\target\release\lcmm.exe)) {
        write-host "[info]`tNo executable found. Building..."
        cargo build --release
        if (-not $?) {
            write-host "[err]`tCould not build. Do you have cargo installed and are you executing from tigerwatch\chell\lcmm?"
            exit -1
        }
    }

    start-process .\target\release\lcmm.exe -WindowStyle Hidden
    write-host $(if ($?) { "[ok]`tlcmm.exe is up at http://localhost:8000!`n`tHappy coding. Check it with '.\lcmm-ctl.ps1 proc'" } else { "[err]`tCould not start process. Are you executing from tigerwatch\chell\lcmm?" })
}

if ($args[0] -eq "proc") {
    write-host "[ok]`tlcmm.exe is not running" 
}





