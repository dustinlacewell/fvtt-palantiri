;;; palantiri.el --- Helpful olp functions

;; Author: Dustin Lacewell <dlacewell@gmail.com>
;; Version: 0.1.0
;; Keywords: org-mode olp
;; Package-Requires: ((emacs "24") (ht "0") (uuidgen "0") (websocket "0") (aio "0"))
;; This is free and unencumbered software released into the public domain.

;; Anyone is free to copy, modify, publish, use, compile, sell, or
;; distribute this software, either in source code form or as a compiled
;; binary, for any purpose, commercial or non-commercial, and by any
;; means.

;; In jurisdictions that recognize copyright laws, the author or authors
;; of this software dedicate any and all copyright interest in the
;; software to the public domain. We make this dedication for the benefit
;; of the public at large and to the detriment of our heirs and
;; successors. We intend this dedication to be an overt act of
;; relinquishment in perpetuity of all present and future rights to this
;; software under copyright law.

;; THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
;; EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
;; MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
;; IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
;; OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
;; ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
;; OTHER DEALINGS IN THE SOFTWARE.

;; For more information, please refer to <http://unlicense.org>

;;; Commentary:

;; Helpful olp commands
;;
;; See documentation at https://github.com/dustinlacewell/fvtt.el

;;; Code:
(use-package aio)
(use-package ht)
(use-package uuidgen)
(use-package websocket)

(require 'aio)
(require 'ht)
(require 'uuidgen)
(require 'websocket)

(defun pal-get (key val)
  (let ((val (car (alist-get key val))))
    (case val
      ((eq :json-false) nil)
      ((eq :json-null) nil)
      (t val))))

(defvar pal-server nil)

(defvar pal-socket nil)

(defvar pal-callbacks nil)

(defun pal--parse-frame (frame)
  (-let* ((json-string (concat pal--buffer (websocket-frame-text frame)))
          (_ (setq pal--buffer ""))
          (_ (message "%s" json-string))
          (data (condition-case nil
                    (json-read-from-string json-string)
                  (error (setq pal--buffer json-string))))
          (id (alist-get 'id data))
          (result (alist-get 'result data)))
    (when (string-equal "" pal--buffer)
      (list id result))))

(defun pal--on-open (ws)
  (setq pal-socket ws)
  (message "Palantiri Connected."))

(defun pal--on-close (ws)
  (setq pal-socket nil)
  (message "Palantiri Disconnected."))

(setq pal--buffer "")

(defun pal--on-message (ws frame)
  (-let (((uuid data) (pal--parse-frame frame)))
    (if uuid
        (progn
          (setq pal--buffer "")
          (let ((promise (ht-get pal-callbacks uuid nil)))
            (when promise
              (aio-resolve promise `(lambda () ',data))
              (ht-remove pal-callbacks uuid)))))))

(defmacro pal-raw (method params)
  (declare (indent defun))
  `(progn
     (let* ((id (uuidgen-4))
            (promise (aio-promise))
            (payload (list "jsonrpc" "2.0" "id" id "method" ,method "params" ,params))
            (json (json-encode-plist payload)))
       (ht-set pal-callbacks id promise)
       (websocket-send-text pal-socket json)
       promise)))

(defmacro pal-raw! (method params)
  `(aio-wait-for (pal-raw ,method ,params)))

(defun pal-intern (ns method)
  (intern (format "%s-%s" ns method)))

(defmacro pal-deftype (type)
  (let ((sym ))
    `(progn
       (pal-defun ,(pal-intern type "all") (&optional keys))
       (pal-defun ,(pal-intern type "one") (pid))
       (pal-defun ,(pal-intern type "get") (pid key))
       (pal-defun ,(pal-intern type "set") (pid key val))
       (pal-defun ,(pal-intern type "getFlag") (pid scope key))
       (pal-defun ,(pal-intern type "setFlag") (pid scope key val))
       (pal-defun ,(pal-intern type "find") (key val))
       (pal-defun ,(pal-intern type "filter") (key val))
       (pal-defun ,(pal-intern type "toggle") (pid key))
       (pal-defun ,(pal-intern type "create") (name))
       (pal-defun ,(pal-intern type "remove") (pid)))))

(defun pal-stop-server ()
  (interactive)
  (when (and (boundp 'pal-server) pal-server)
    (websocket-server-close pal-server)))

(defun pal-start-server ()
  (interactive)
  (pal-stop-server)
  (setq pal-callbacks (ht-create))
  (setq pal-server (websocket-server 3000
                                      :host 'local
                                      :on-open 'pal--on-open
                                      :on-message 'pal--on-message
                                      :on-close 'pal--on-close)))

(defun pal-rpc (ns method params)
  (let ((method (format "%s.%s" ns method))
        (params (seq-into params 'vector)))
    (eval `(pal-raw! ',method ',params))))

(defmacro pal-defun (name &optional args)
  (-let* (((ns method) (s-split "-" (symbol-name name)))
          (fun-name (intern (format "pal-%s-%s" ns method)))
          (filtered-args (--filter (not (s-starts-with? "&" (symbol-name it))) args)))
    `(defun ,fun-name ,args
       (pal-rpc ,ns ,method ,`(vector ,@filtered-args)))))

(pal-deftype actors)

(pal-deftype folders)

(pal-deftype items)

(pal-deftype journal)

(pal-deftype messages)

(pal-deftype playlists)

(pal-deftype scenes)

(pal-deftype tables)

(pal-deftype u)

(provide 'palantiri)
