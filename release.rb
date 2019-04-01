#!/usr/bin/env ruby
# encoding: utf-8
#
# Introduction:
#   xdialog release tool to create xdialog.<tag>.zip & xdialog.<tag>.min.zip
#
#   use the following command to install terser & cleancss
#       npm install terser clean-css-cli -g
#
# Usage:
#   > ruby release.rb --help
#
# Examples:
#   > ruby release.rb --tag 2.2.0
#   > ruby release.rb -t 2.2.0
#

require 'colorize'
require 'fileutils'
require 'optparse'
require 'zip'

################################################################
# methods

module XDRelease
    def self.create_zip tag
        File.open("xdialog.#{tag}.css", 'wb:utf-8') do |f|
            f.puts file_header File.basename f
            f.write IO.read "xdialog.css", mode: 'rb:utf-8'
        end

        File.open("xdialog.#{tag}.js", 'wb:utf-8') do |f|
            f.puts file_header File.basename f
            f.write IO.read "xdialog.js", mode: 'rb:utf-8'
        end

        Zip::File.open "xdialog.#{tag}.zip", Zip::File::CREATE do |zf|
            zf.add "xidalog.#{tag}/xdialog.#{tag}.css", "xdialog.#{tag}.css"
            zf.add "xidalog.#{tag}/xdialog.#{tag}.js", "xdialog.#{tag}.js"
        end

        FileUtils.rm ["xdialog.#{tag}.css", "xdialog.#{tag}.js"]
    end

    def self.create_min_zip tag
        `cleancss -o xdialog.#{tag}.min.css xdialog.css`
        append_header "xdialog.#{tag}.min.css"

        `terser xdialog.js -o xdialog.#{tag}.min.js -c -m`
        append_header "xdialog.#{tag}.min.js"

        Zip::File.open "xdialog.#{tag}.min.zip", Zip::File::CREATE do |zf|
            zf.add "xidalog.#{tag}/xdialog.#{tag}.min.css", "xdialog.#{tag}.min.css"
            zf.add "xidalog.#{tag}/xdialog.#{tag}.min.js", "xdialog.#{tag}.min.js"
        end

        FileUtils.rm ["xdialog.#{tag}.min.css", "xdialog.#{tag}.min.js"]
    end

    def self.file_header content
        return <<~END
        /**
         * #{content}
         * https://github.com/xxjapp/xdialog
         */

        END
    end

    def self.append_header path
        content = IO.binread path

        File.open path, 'wb' do |f|
            f.puts file_header File.basename f
            f.write content
        end
    end
end

################################################################
# main

if __FILE__ == $0
    params = ARGV.getopts nil, 'tag:'

    if !params['tag']
        $stderr.puts 'Tag not found!'.red
        exit -1
    end

    XDRelease.create_zip params['tag']
    XDRelease.create_min_zip params['tag']
end
