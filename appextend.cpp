#include <QGraphicsWebView>
#include <QWebFrame>
#include <QStyle>
#include <QDesktopWidget>
#include <QRect>
#include <QObject>
#include <QFileDialog>
#include <QIODevice>
#include <QTextStream>
#include <QDir>
#include <QDebug>
#include <QMessageBox>
#include <QCryptographicHash>
#include <QClipboard>
#include <QApplication>
#include "appextend.h"
#include "html5applicationviewer.h"

AppExtend::AppExtend(QObject *parent) : QObject(parent){
    JSVar = "AppExtend";
    LastErrorCode = 0;
    LastErrorString = "";
}

void AppExtend::setupViewer(Html5ApplicationViewer *v){
    viewer = v;
    connect(viewer->webView()->page()->mainFrame(),
            SIGNAL(javaScriptWindowObjectCleared()),
            SLOT(addJavascript()));
}

void AppExtend::addJavascript(){
    viewer->webView()->page()->mainFrame()->addToJavaScriptWindowObject(JSVar,this);
}

bool AppExtend::setJSVar(QString string){
    if(string.contains(QRegExp("[^a-zA-Z]"))){
        qDebug() << "Invalid Charectors in JSVar. Letters Only.";
        return false;
    }
    JSVar = string;
    return true;
}

QString AppExtend::getJSVar(){
    return JSVar;
}

QObject* AppExtend::Resize(int w, int h){
    int totalHeight = h + viewer->frameGeometry().height() - viewer->geometry().height();
    QDesktopWidget *d = new QDesktopWidget();
    QRect ss = d->availableGeometry();
    int useHeight = totalHeight < ss.height() ? totalHeight : ss.height();
    viewer->setFixedSize(w,useHeight);
    QObject *out = new QObject();
    out->setProperty("Width",w);
    out->setProperty("Height",useHeight);
    return out;
}

QString AppExtend::SaveFilePrompt(QString filename){
    QString defaultSave = QDir::homePath()+QDir::separator()+filename;
    QString fileName = QFileDialog::getSaveFileName(
                viewer,
                tr("Save File"),
                defaultSave
           );
   return fileName;
}

QString AppExtend::OpenFilePrompt(bool many){
    QString fileName = "";
    if(many){
        QStringList fileNames = QFileDialog::getOpenFileNames(
                    viewer,
                    tr("Open Files")
                );

        for(int i = 0; i < fileNames.size(); ++i){
            fileName += fileNames.at(i) + ";";
        }
    } else {
        fileName = QFileDialog::getOpenFileName(
                    viewer,
                    tr("Open File")
                );
    }
    return fileName;

}

bool AppExtend::WriteFile(QString filePath, QString fileData){

    if(filePath != ""){
        QFile file(filePath);
        if(file.open(QIODevice::WriteOnly)){
            QTextStream out(&file);
            out << fileData;
        } else {
            LastErrorCode = 1;
            LastErrorString = "The selected file could not be written to.";
            emit error();
            return false;
        }
    } else {
        LastErrorCode = 2;
        LastErrorString = "There was an error getting the selected file location.";
        emit error();
        return false;
    }

    return true;
}

QString AppExtend::ReadFile(QString filePath){
    QObject *r = new QObject();

    r->setProperty("didRead",false);
    r->setProperty("errorCode",0);
    r->setProperty("errorString","");
    r->setProperty("fileData","");

    QString fileData;

    if(filePath != ""){
        QFile file(filePath);
        if(file.open(QIODevice::ReadOnly)){
            QTextStream in(&file);
            fileData = in.readAll();
        } else {
            LastErrorCode = 1;
            LastErrorString = "The selected file could not be read from.";
            emit error();
            return "";
        }
    } else {
        LastErrorCode = 2;
        LastErrorString = "There was an error getting the selected file location.";
        emit error();
        return "";
    }

    return fileData;
}

QString AppExtend::MD5(QString string){
    QByteArray data;
    data.append(string);
    return QString(QCryptographicHash::hash((data),QCryptographicHash::Md5).toHex());
}

bool AppExtend::ShowMessage(QString message){
    QMessageBox msg;
    msg.setText(message);
    msg.exec();
    return true;
}

bool AppExtend::ShowPrompt(QString question){
    QMessageBox msg;
    msg.setText(question);
    msg.addButton(QMessageBox::Cancel);
    msg.addButton(QMessageBox::Ok);
    int i = msg.exec();
    return i == QMessageBox::Ok;
}

QString AppExtend::GetClipboard(){
    QClipboard *clipboard = QApplication::clipboard();
    return clipboard->text();
}

bool AppExtend::SetClipboard(QString text){
    QClipboard *clipboard = QApplication::clipboard();
    clipboard->setText(text);
    return true;
}

QObject* AppExtend::GetLastError(){
    QObject *r = new QObject;
    r->setProperty("code",LastErrorCode);
    r->setProperty("string",LastErrorString);
    return r;
}
