import { formatNumber } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-awstoken',
  templateUrl: './awstoken.component.html',
  styleUrls: ['./awstoken.component.scss']
})
export class AwstokenComponent {
  converter!: FormGroup;
  ngOnInit(): void {
    this.converter = new FormGroup({
      normal: new FormControl(null),
      converted: new FormControl(null)
    })

  }
  onConvert() {
    if (this.converter.get('normal')?.value) {
      // Split the text into lines
      const lines = this.converter.get('normal')?.value.split('\n');

      // Initialize an object to store AWS credentials
      const awsCredentials: { [key: string]: string } = {};

      // Loop through the lines and extract AWS credentials dynamically
      for (const line of lines) {
        const keyValue = line.split('=');
        if (keyValue.length === 2) {
          const key = keyValue[0].trim();
          const value = keyValue[1].trim();
          awsCredentials[key] = value;
        }
      }

      // Check if the required credentials are defined
      if (
        awsCredentials['aws_access_key_id'] &&
        awsCredentials['aws_secret_access_key'] &&
        awsCredentials['aws_session_token']
      ) {
        // Create a new object with renamed keys
        const renamedCredentials: any = {
          accessKeyId: awsCredentials['aws_access_key_id'],
          secretAccessKey: awsCredentials['aws_secret_access_key'],
          sessionToken: awsCredentials['aws_session_token']
        };

        // Convert the object to a string with unquoted keys
        const convertedCredentials = Object.keys(renamedCredentials)
          .map(key => `${key}: '${renamedCredentials[key]}'`)
          .join(',\n');

        this.converter.patchValue({ converted: convertedCredentials });
      } else {
        this.converter.patchValue({ converted: 'Required AWS credentials are missing or invalid' });
      }
    }
  }

}
