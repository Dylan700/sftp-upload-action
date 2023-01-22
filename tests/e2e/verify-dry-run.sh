#!/bin/sh

# check that no files were uploaded
echo "checking ./tmp/src"
ls ./tmp/src
if scp -i ./key -o "StrictHostKeyChecking no" -P 2222 -r -B username@sftp-server:/config/src ./tmp/src; then
	echo "found src directory uploaded when it shouldn't exist!"
	ls ./tmp/src
	exit 1
fi

if scp -i ./key -o "StrictHostKeyChecking no" -P 2222 -r -B username@sftp-server:/config/dist ./tmp/dist;  then
	echo "found dist directory uploaded when it shouldn't exist!"
	exit 1
fi

exit 0