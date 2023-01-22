#!/bin/sh

# check that no files were uploaded

if ssh -i ./key -o "StrictHostKeyChecking=no" -p 2222 username@sftp-server stat /config/src \> /dev/null 2\>\&1; then
	echo "found src directory uploaded when it shouldn't exist!"
	exit 1
fi

if ssh -i ./key -o "StrictHostKeyChecking=no" -p 2222 username@sftp-server stat /config/dist \> /dev/null 2\>\&1;  then
	echo "found dist directory uploaded when it shouldn't exist!"
	exit 1
fi

exit 0