package com.hamletshu.mydid;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private Button introduceBtn;
    private Button loginBtn;
    private Button boardBtn;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        introduceBtn = (Button)findViewById(R.id.introduceBtn);
        loginBtn = (Button)findViewById(R.id.loginBtn);
        boardBtn = (Button)findViewById(R.id.boardBtn);

        introduceBtn.setOnClickListener(this);
        loginBtn.setOnClickListener(this);
        boardBtn.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {

        switch (v.getId()){
            case R.id.introduceBtn :
                Intent introduceActivity = new Intent(MainActivity.this, IntroduceActivity.class);
                startActivity(introduceActivity);
            break;
            case R.id.loginBtn :
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("https://mydid.kro.kr"));
                intent.setPackage("com.android.chrome");
                startActivity(intent);
            break;
            case R.id.boardBtn :
                Intent webViewActivity = new Intent(MainActivity.this, WebViewActivity.class);
                startActivity(webViewActivity);
            break;
        }
    }
}
