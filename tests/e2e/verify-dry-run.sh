#!/bin/sh

# check that no files were uploaded
scp -i ./key -o "StrictHostKeyChecking no" -P 2222 -r -B username@sftp-server:/config/src ./tmp/src
scp -i ./key -o "StrictHostKeyChecking no" -P 2222 -r -B username@sftp-server:/config/dist ./tmp/dist;

if ![ -z "$(ls -A ./tmp/src)" ]; then
	echo "found src directory uploaded when it shouldn't exist!"
	exit 1
fi

if ![ -z "$(ls -A ./tmp/src)" ]; then
	echo "found dist directory uploaded when it shouldn't exist!"
	exit 1
fi

exit 0