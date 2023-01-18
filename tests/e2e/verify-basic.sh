#!/bin/sh

# check that src and dist were updated, with no .txt files

# download files first
scp -i ./key -o "StrictHostKeyChecking no" -P 2222 -r -B username@sftp-server:/config/src ./tmp/src
scp -i ./key -o "StrictHostKeyChecking no" -P 2222 -r -B username@sftp-server:/config/dist ./tmp/dist

rm ./dist/*.txt

# check uploaded src directory matches checked out src directory
 if [ "$(diff -r ./tmp/src/ ./src/ | wc -l)" -gt "0" ]; then
	echo "Files that were uploaded were not as expected."
	diff -r ./tmp/src/ ./src/
	exit 1
fi

# check uploaded dist directory matches checked out dist directory
 if [ "$(diff -r ./tmp/dist/ ./dist/ | wc -l)" -gt "0" ]; then
	echo "Files that were uploaded were not as expected."
	diff -r ./tmp/dist/ ./dist/
	exit 1
fi
exit 0