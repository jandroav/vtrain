#!/bin/bash

# windows
GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" .
zip vtrain_windows.zip vtrain.exe
rm -rf vtrain.exe
# linux
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" .
zip vtrain_linux.zip vtrain
rm -rf vtrain
# mac arm
GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" .
zip vtrain_mac_arm.zip vtrain
rm -rf vtrain
# mac intel
GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" .
zip vtrain_mac_intel.zip vtrain
rm -rf vtrain