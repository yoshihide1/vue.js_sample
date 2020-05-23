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
                id="fieldset-1"
                label="Email"
                label-for="input-1"
                :invalid-feedback="invalidFeedback"
                :valid-feedback="validFeedback"
                :state="state"
              >
                <b-form-input
                  id="input-1"
                  v-model="username"
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
              <b-button variant="outline-success" @click="signIn">Login</b-button>or
              <b-button variant="outline-success" @click="signUp">Create</b-button>
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
      return this.username.length >= 8 ? true : false;
    },
    invalidFeedback() {
      if (this.username.length > 7) {
        return "";
      } else if (this.username.length > 0) {
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
      username: "",
      password: ""
    };
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then(() => {
          alert("サインイン完了");
          this.$emit("signs");
          this.$router.push("/");
        })
        .catch(error => {
          alert(error.message);
        });
    },
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(user => {
          alert("新規登録完了", user.email);
          this.$emit("signs");
          this.$router.push("/");
        })
        .catch(error => {
          alert(error.message);
        });
    }
  }
};
</script>

<style>
</style>