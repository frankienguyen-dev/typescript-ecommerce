import{r as v,A as b,u as y,a as w,o as E,b as A,c as S,j as e,d,L as j,p as L,s as k,e as C}from"./index-218255ac.js";import{B as M}from"./Button-5d55b0d0.js";import{I as p}from"./Input-0ce94ac9.js";const B=k.pick(["password","email"]);function V(){var i,c;const{isAuthenticated:I,setIsAuthenticated:g,profile:F,setProfile:u}=v.useContext(b),h=y(),{handleSubmit:f,register:o,setError:x,formState:{errors:n}}=w({resolver:E(B)}),t=A({mutationFn:s=>C.loginAccount(s)}),N=f(s=>{console.log("check data login: ",s),t.mutate(s,{onSuccess:a=>{g(!0),u(a.data.data.user),h("/")},onError:a=>{var l;if(S(a)){const r=(l=a.response)==null?void 0:l.data.data;r&&Object.keys(r).forEach(m=>{x(m,{message:r[m],type:"Server"})})}}})});return e("div",{className:"bg-orange",children:e("div",{className:"container",children:e("div",{className:"grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-20 lg:pr-10",children:e("div",{className:"lg:col-span-2 lg:col-start-4",children:d("form",{className:"rounded bg-white p-[30px] shadow-sm",onSubmit:N,noValidate:!0,children:[e("div",{className:"text-[1.25rem]",children:"Đăng nhập"}),e(p,{className:"mt-8",type:"email",placeholder:"Email",name:"email",register:o,errorMessage:(i=n.email)==null?void 0:i.message,autoComplete:"on"}),e(p,{className:"mt-2",type:"password",placeholder:"Password",name:"password",register:o,errorMessage:(c=n.password)==null?void 0:c.message,autoComplete:"on"}),e("div",{className:"mt-3",children:e(M,{type:"submit",className:"flex w-full items-center justify-center rounded-sm bg-orange py-4 px-2 text-center text-white",isLoading:t.isLoading,disabled:t.isLoading,children:"Đăng nhập"})}),e("div",{className:"mt-8  text-center ",children:d("div",{className:"flex items-center justify-center ",children:[e("span",{className:" text-black/[0.26]",children:"Bạn mới biết đến Shopee?"}),e(j,{to:L.register,children:e("span",{className:"pl-1 text-orange hover:cursor-pointer",children:"Đăng ký"})})]})})]})})})})})}export{V as default};
