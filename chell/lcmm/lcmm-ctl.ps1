$cur_proc = Get-Process |? Name -match "lcmm"

try {
    if (@("start", "stop", "proc").Contains($args[0]) -ne $true) {
        throw "invalid args"
    }
} catch { 
    Write-Host "Usage: .\lcmm-ctl.ps1 start|stop|proc"
    exit -1
}

if ($cur_proc -ne $null) {
    if ($args[0] -eq "stop") {
        stop-process $cur_proc
        write-host "[ok]`tterminated"
    } elseif ($args[0] -eq "start") {
        write-host "[err]`tlcmm is already running. Run '.\lcmm-ctl.ps1 stop' to stop the server"
        exit -1
    } else {
        write-output $cur_proc
    }
    
    exit 0
}

# if there was a process and the command was "stop", it would have been handled in the block above
if ($args[0] -eq "stop") {
    write-host "[err]`tNo running instance of lcmm found. Check with '.\lcmm-ctl.ps1 proc'?"
    exit -1
}

if ($args[0] -eq "start") {
    if ($(Test-Path -Path .\target\release\lcmm.exe) -eq $false) {
        Write-Host "[info]`tNo executable found. Building..."
        cargo build --release
    }

    start-process .\target\release\lcmm.exe -WindowStyle Hidden
    Write-Host "[ok]`tlcmm.exe is up at localhost:8000! Happy coding. Check it with '.\lcmm-ctl.ps1 proc'"
}

if ($args[0] -eq "proc") {
    write-host "[ok]`tlcmm.exe is not running" 
}





