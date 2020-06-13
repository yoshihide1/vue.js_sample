<template>
  <div>
    <b-container>
      <b-row>
        <b-col>
          <b-card
            bg-variant="dark"
            text-variant="white"
            header="ログイン or 新規登録"
            class="text-center mt-5"
          >
            <b-card-text>
              <b-form-group
                id="fieldset-3"
                label="displayName"
                label-for="input-3"
                :invalid-feedback="invalidFeedback"
                :valid-feedback="validFeedback"
              >
                <b-form-input
                  id="input-3"
                  v-model="displayName"
                  trim
                  placeholder="表示される名前(全角,半角文字)"
                  type="text"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="fieldset-1"
                label="Email"
                label-for="input-1"
                :invalid-feedback="invalidFeedback"
                :valid-feedback="validFeedback"
                :state="state"
              >
                <b-form-input
                  id="input-1"
                  v-model="email"
                  :state="state"
                  trim
                  placeholder="メールアドレス"
                  type="email"
                ></b-form-input>
              </b-form-group>

              <b-form-group
                id="fieldset-2"
                label="Passwaord"
                label-for="input-2"
                :invalid-feedback="invalidFeedback2"
                :valid-feedback="validFeedback2"
                :state="state2"
              >
                <b-form-input
                  id="input-2"
                  v-model="password"
                  :state="state2"
                  trim
                  placeholder="パスワード₍半角英数字6文字以上₎"
                  type="password"
                ></b-form-input>
              </b-form-group>
              <b-row align-h="center">
                <b-button class="mr-2" variant="outline-success" @click="signIn">Login</b-button>
                <i class="fas fa-arrows-alt-h fa-2x"></i>
                <b-button class="ml-2" variant="outline-success" @click="signUp">Create</b-button>
              </b-row>
              <b-button class="mt-3" variant="outline-info" @click="easyLogin">簡単ログイン</b-button>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Sign",
  computed: {
    state() {
      const check = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
      return this.email.match(check) ? true : false;
    },
    invalidFeedback() {
      if (this.email.length > 7) {
        return "";
      } else if (this.email.length > 0) {
        return "文字数が少なすぎます";
      } else {
        return "入力してください";
      }
    },
    validFeedback() {
      return this.state === true ? "Thank you" : "";
    },
    state2() {
      return this.password.length >= 6 ? true : false;
    },
    invalidFeedback2() {
      if (this.password.length > 5) {
        return "";
      } else if (this.password.length > 0) {
        return "文字数が少なすぎます";
      } else {
        return "入力してください";
      }
    },
    validFeedback2() {
      return this.state === true ? "Thank you" : "";
    }
  },
  data() {
    return {
      displayName: null,
      email: "",
      password: "",
      functions: firebase.functions()
    };
  },
  methods: {
    easyLogin() {
      firebase
        .auth()
        .signInAnonymously()
        .then(() => {
          alert("簡単ログイン");
          this.$router.push("/");
        })
        .catch(() => {
          console.log("error");
        });
    },
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          alert("サインイン完了");
          this.$router.push("/");
        })
        .catch(() => {
          alert("一致する登録情報がありません");
        });
    },
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(result => {
          const userProfile = firebase.auth().currentUser;
          userProfile.updateProfile({
            displayName: this.displayName
          });
          alert("新規登録完了");
          this.setUserData(result);
          this.$router.push("/");
        })
        .catch(() => {
          alert("入力に誤りがあるか、既に登録されています");
        });
    },
    setUserData(data) {
      const email = data.user.email;
      const user = this.functions.httpsCallable("user");
      user({
        displayName: this.displayName,
        email: email
      })
        .then(() => {
          console.log("ユーザー登録OK");
        })
        .catch(() => {
          console.error("error");
        });
    }
  }
};
</script>

<style>
</style>