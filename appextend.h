#ifndef APPEXTEND_H
#define APPEXTEND_H

#include <QObject>
#include <QString>
#include "html5applicationviewer.h"

class AppExtend : public QObject
{
    Q_OBJECT
public:
    explicit AppExtend(QObject *parent = 0);
    void setupViewer(Html5ApplicationViewer *v);
    bool setJSVar(QString string);
    QString getJSVar();

private:
    Html5ApplicationViewer *viewer;
    QString JSVar;
    int LastErrorCode;
    QString LastErrorString;


signals:
    void error();

public slots:
    void addJavascript();
    QObject* Resize(int w, int h);
    QString SaveFilePrompt(QString filename);
    QString OpenFilePrompt(bool many = false);
    bool WriteFile(QString filePath, QString fileData);
    QString ReadFile(QString filePath);
    QString MD5(QString string);
    bool ShowMessage(QString message);
    bool ShowPrompt(QString question);
    QString GetClipboard();
    bool SetClipboard(QString text);
    QObject* GetLastError();

};
#endif // APPEXTEND_H
